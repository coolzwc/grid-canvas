import React, { useState, useEffect, useCallback, Children, isValidElement, useMemo } from 'react';
import type { Viewport, InteractionMode } from '@grid-canvas/core';
import {
  DEFAULT_COLS,
  DEFAULT_ROW_HEIGHT,
  DEFAULT_MARGIN,
  DEFAULT_CONTAINER_PADDING,
  DEFAULT_MAX_ROWS,
  DEFAULT_MIN_ZOOM,
  DEFAULT_MAX_ZOOM,
  DEFAULT_DRAG_THRESHOLD,
  DEFAULT_RESIZE_HANDLES,
} from '@grid-canvas/core';
import { createGridCanvasStore } from '../store/createStore';
import { GridCanvasContext } from '../contexts/GridCanvasContext';
import { ZoomPane } from './ZoomPane';
import { CanvasViewport } from './CanvasViewport';
import { ItemRenderer } from './ItemRenderer';
import { Placeholder } from './Placeholder';
import { useContainerSize } from '../hooks/useContainerSize';
import type { GridCanvasProps } from '../types';

export function GridCanvas({
  children,
  items,
  onItemsChange,
  cols = DEFAULT_COLS,
  rowHeight = DEFAULT_ROW_HEIGHT,
  margin = DEFAULT_MARGIN,
  containerPadding = DEFAULT_CONTAINER_PADDING,
  maxRows = DEFAULT_MAX_ROWS,
  compactType = 'vertical',
  preventCollision = false,
  draggable = true,
  resizable = true,
  resizeHandles = DEFAULT_RESIZE_HANDLES,
  dragHandle,
  dragCancel,
  dragThreshold = DEFAULT_DRAG_THRESHOLD,
  defaultViewport = { x: 0, y: 0, zoom: 1 },
  minZoom = DEFAULT_MIN_ZOOM,
  maxZoom = DEFAULT_MAX_ZOOM,
  panning = false,
  zooming = false,
  defaultInteractionMode = 'select',
  onInteractionModeChange,
  onlyRenderVisibleItems = false,
  itemTypes,
  onDragStart,
  onDrag,
  onDragStop,
  onResizeStart,
  onResize,
  onResizeStop,
  onViewportChange,
  className,
  style,
}: GridCanvasProps) {
  const [store] = useState(() => {
    const s = createGridCanvasStore({ cols, rowHeight, margin, containerPadding, maxRows });
    s.setState({ interactionMode: defaultInteractionMode });
    return s;
  });

  // Sync items prop into store
  useEffect(() => {
    store.getState().updateLayout(items);
  }, [items, store]);

  // Notify parent when interaction mode changes
  useEffect(() => {
    if (!onInteractionModeChange) return;
    const unsub = store.subscribe((state, prevState) => {
      if (state.interactionMode !== prevState.interactionMode) {
        onInteractionModeChange(state.interactionMode);
      }
    });
    return unsub;
  }, [onInteractionModeChange, store]);

  // Sync config changes
  useEffect(() => {
    store.setState({
      cols,
      rowHeight,
      margin,
      containerPadding,
      maxRows,
      compactType,
      preventCollision,
      draggable,
      resizable,
    });
  }, [cols, rowHeight, margin, containerPadding, maxRows, compactType, preventCollision, draggable, resizable, store]);

  // Notify parent of layout changes
  useEffect(() => {
    if (!onItemsChange) return;
    const unsub = store.subscribe((state, prevState) => {
      if (state.items !== prevState.items) {
        onItemsChange(state.items);
      }
    });
    return unsub;
  }, [onItemsChange, store]);

  const handleResize = useCallback(
    (width: number, height: number) => {
      store.getState().setDimensions(width, height);
    },
    [store]
  );

  const containerRef = useContainerSize(handleResize);

  // Separate item children from plugin children (Background, Controls, MiniMap)
  const { itemChildren, pluginChildren } = useMemo(() => {
    const itemKids: React.ReactNode[] = [];
    const pluginKids: React.ReactNode[] = [];

    Children.forEach(children, (child) => {
      if (isValidElement(child)) {
        const type = child.type as any;
        if (type?.__isGridCanvasPlugin === true) {
          pluginKids.push(child);
        } else {
          itemKids.push(child);
        }
      }
    });

    return { itemChildren: itemKids, pluginChildren: pluginKids };
  }, [children]);

  return (
    <GridCanvasContext.Provider value={store}>
      <div
        ref={containerRef}
        className={`gc-container ${className || ''}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          ...style,
        }}
      >
        <ZoomPane
          minZoom={minZoom}
          maxZoom={maxZoom}
          defaultViewport={defaultViewport}
          panning={panning}
          zooming={zooming}
          onViewportChange={onViewportChange}
        >
          <CanvasViewport>
            <Placeholder />
            <ItemRenderer
              onlyRenderVisibleItems={onlyRenderVisibleItems}
              itemTypes={itemTypes}
              resizeHandles={resizeHandles}
              dragHandle={dragHandle}
              dragCancel={dragCancel}
              dragThreshold={dragThreshold}
              draggable={draggable}
              resizable={resizable}
              onDragStart={onDragStart}
              onDrag={onDrag}
              onDragStop={onDragStop}
              onResizeStart={onResizeStart}
              onResize={onResize}
              onResizeStop={onResizeStop}
            >
              {itemChildren}
            </ItemRenderer>
          </CanvasViewport>
        </ZoomPane>

        {/* Plugin children render outside the viewport (fixed position) */}
        {pluginChildren}
      </div>
    </GridCanvasContext.Provider>
  );
}
