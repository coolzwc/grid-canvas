import React, { memo, useRef, useEffect, useCallback } from 'react';
import type { ComponentType } from 'react';
import {
  calcXY,
  calcWH,
  calcGridItemPosition,
  createDragHandler,
  type LayoutItem,
  type ResizeHandleAxis,
} from '@grid-canvas/core';
import { useStoreApi } from '../contexts/GridCanvasContext';
import { useStore } from '../hooks/useStore';
import type { ItemComponentProps } from '../types';

const DEFAULT_RESIZE_HANDLES: ResizeHandleAxis[] = ['se'];

export interface ItemWrapperProps {
  id: string;
  children?: React.ReactNode;
  itemTypes?: Record<string, ComponentType<ItemComponentProps>>;
  resizeHandles?: ResizeHandleAxis[];
  dragHandle?: string;
  dragCancel?: string;
  dragThreshold?: number;
  draggable?: boolean;
  resizable?: boolean;
  onDragStart?: (item: LayoutItem, event: PointerEvent) => void;
  onDrag?: (item: LayoutItem, event: PointerEvent) => void;
  onDragStop?: (item: LayoutItem, event: PointerEvent) => void;
  onResizeStart?: (item: LayoutItem, event: PointerEvent) => void;
  onResize?: (item: LayoutItem, event: PointerEvent) => void;
  onResizeStop?: (item: LayoutItem, event: PointerEvent) => void;
}

export const ItemWrapper = memo(function ItemWrapper({
  id,
  children,
  itemTypes,
  resizeHandles = DEFAULT_RESIZE_HANDLES,
  dragHandle,
  dragCancel,
  dragThreshold = 3,
  draggable = true,
  resizable = true,
  onDragStart,
  onDrag,
  onDragStop,
  onResizeStart,
  onResize,
  onResizeStop,
}: ItemWrapperProps) {
  const store = useStoreApi();
  const elementRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ destroy: () => void } | null>(null);

  const callbacksRef = useRef({ onDragStart, onDrag, onDragStop, onResizeStart, onResize, onResizeStop });
  callbacksRef.current = { onDragStart, onDrag, onDragStop, onResizeStart, onResize, onResizeStop };

  const internalItem = useStore(
    useCallback((s) => s.itemLookup.get(id), [id])
  );
  const layoutItem = useStore(
    useCallback((s) => s.items.find((item) => item.i === id), [id])
  );
  const isSelected = useStore(
    useCallback((s) => s.selectedIds.has(id), [id])
  );
  const activeDrag = useStore((s) =>
    s.activeDrag?.itemId === id ? s.activeDrag : null
  );
  const activeResize = useStore((s) =>
    s.activeResize?.itemId === id ? s.activeResize : null
  );

  if (!internalItem || !layoutItem) return null;

  const isDragging = activeDrag !== null;
  const isResizing = activeResize !== null;
  const { pixelPosition } = internalItem;

  // During drag/resize, use continuous pixel position for smooth rendering
  const renderLeft = isDragging
    ? activeDrag.pixelLeft
    : isResizing
      ? activeResize.pixelLeft
      : pixelPosition.left;
  const renderTop = isDragging
    ? activeDrag.pixelTop
    : isResizing
      ? activeResize.pixelTop
      : pixelPosition.top;
  const renderWidth = isResizing ? activeResize.pixelWidth : pixelPosition.width;
  const renderHeight = isResizing ? activeResize.pixelHeight : pixelPosition.height;

  const interactionMode = useStore((s) => s.interactionMode);
  const itemDraggable = interactionMode === 'hand' ? false : (layoutItem.isDraggable ?? draggable);
  const itemResizable = layoutItem.isResizable ?? resizable;
  const handles = layoutItem.resizeHandles ?? resizeHandles;

  // Setup drag handler
  useEffect(() => {
    const el = elementRef.current;
    if (!el || !itemDraggable) return;

    const handler = createDragHandler(el, {
      threshold: dragThreshold,
      handle: dragHandle,
      cancel: dragCancel || '.gc-resize-handle',
      onStart(e) {
        const state = store.getState();
        const item = state.items.find((i) => i.i === id);
        if (!item) return;
        const params = state.getPositionParams();
        const pos = calcGridItemPosition(params, item.x, item.y, item.w, item.h);
        state.startDrag({
          itemId: id,
          x: item.x,
          y: item.y,
          originalX: item.x,
          originalY: item.y,
          offsetX: 0,
          offsetY: 0,
          pixelLeft: pos.left,
          pixelTop: pos.top,
        });
        callbacksRef.current.onDragStart?.(item, e);
      },
      onMove(e, deltaX, deltaY) {
        const state = store.getState();
        const drag = state.activeDrag;
        if (!drag) return;
        const zoom = state.transform[2];
        const params = state.getPositionParams();
        const currentItem = state.items.find((item) => item.i === id);
        if (!currentItem) return;

        const originalPos = calcGridItemPosition(
          params,
          drag.originalX,
          drag.originalY,
          currentItem.w,
          currentItem.h
        );
        const newLeft = originalPos.left + deltaX / zoom;
        const newTop = originalPos.top + deltaY / zoom;
        const { x, y } = calcXY(params, newTop, newLeft, currentItem.w, currentItem.h);

        state.updateDrag(x, y, newLeft, newTop);
        const updatedItem = state.items.find((item) => item.i === id);
        if (updatedItem) callbacksRef.current.onDrag?.(updatedItem, e);
      },
      onEnd(e) {
        store.getState().endDrag();
        const finalItem = store.getState().items.find((item) => item.i === id);
        if (finalItem) callbacksRef.current.onDragStop?.(finalItem, e);
      },
    });

    dragRef.current = handler;
    return () => handler.destroy();
  }, [id, itemDraggable, dragHandle, dragCancel, dragThreshold]);

  const resizeCleanupRef = useRef<(() => void) | null>(null);

  // Cleanup resize listeners on unmount
  useEffect(() => {
    return () => {
      resizeCleanupRef.current?.();
    };
  }, []);

  const handleResizePointerDown = useCallback(
    (handle: ResizeHandleAxis, e: React.PointerEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;

      const state = store.getState();
      const startItem = state.items.find((item) => item.i === id);
      if (!startItem) return;

      const origParams = state.getPositionParams();
      const origPos = calcGridItemPosition(
        origParams,
        startItem.x,
        startItem.y,
        startItem.w,
        startItem.h
      );

      state.startResize({
        itemId: id,
        w: startItem.w,
        h: startItem.h,
        originalW: startItem.w,
        originalH: startItem.h,
        handle,
        pixelWidth: origPos.width,
        pixelHeight: origPos.height,
        pixelLeft: origPos.left,
        pixelTop: origPos.top,
      });
      callbacksRef.current.onResizeStart?.(startItem, e.nativeEvent);

      function onPointerMove(ev: PointerEvent) {
        const state = store.getState();
        const zoom = state.transform[2];
        const params = state.getPositionParams();

        // deltaX/Y are total offsets from resize start, so use the
        // original pixel dimensions (not the already-resized current item)
        const deltaX = (ev.clientX - startX) / zoom;
        const deltaY = (ev.clientY - startY) / zoom;

        let newWidth = origPos.width;
        let newHeight = origPos.height;

        if (handle.includes('e')) newWidth += deltaX;
        if (handle.includes('w')) newWidth -= deltaX;
        if (handle.includes('s')) newHeight += deltaY;
        if (handle.includes('n')) newHeight -= deltaY;

        const { w, h } = calcWH(
          params,
          Math.max(20, newWidth),
          Math.max(20, newHeight),
          startItem.x,
          startItem.y
        );

        const minW = startItem.minW ?? 1;
        const maxW = startItem.maxW ?? state.cols;
        const minH = startItem.minH ?? 1;
        const maxH = startItem.maxH ?? Infinity;

        const clampedW = Math.max(minW, Math.min(maxW, w));
        const clampedH = Math.max(minH, Math.min(maxH, h));

        let newX: number | undefined;
        let newY: number | undefined;

        if (handle.includes('w')) {
          newX = startItem.x + (startItem.w - clampedW);
        }
        if (handle.includes('n')) {
          newY = startItem.y + (startItem.h - clampedH);
        }

        // Compute continuous pixel position for smooth rendering
        let pixelLeft = origPos.left;
        let pixelTop = origPos.top;
        if (handle.includes('w')) pixelLeft = origPos.left + deltaX;
        if (handle.includes('n')) pixelTop = origPos.top + deltaY;

        state.updateResize(clampedW, clampedH, newX, newY, {
          width: Math.max(20, newWidth),
          height: Math.max(20, newHeight),
          left: pixelLeft,
          top: pixelTop,
        });
        const updatedItem = state.items.find((item) => item.i === id);
        if (updatedItem) callbacksRef.current.onResize?.(updatedItem, ev);
      }

      function onPointerUp(ev: PointerEvent) {
        store.getState().endResize();
        const finalItem = store.getState().items.find((item) => item.i === id);
        if (finalItem) callbacksRef.current.onResizeStop?.(finalItem, ev);
        cleanup();
      }

      function cleanup() {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        resizeCleanupRef.current = null;
      }

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
      resizeCleanupRef.current = cleanup;
    },
    [id, store]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      store.getState().selectItem(id, e.metaKey || e.ctrlKey);
    },
    [id, store]
  );

  return (
    <div
      ref={elementRef}
      className={`gc-item ${isDragging ? 'gc-item--dragging' : ''} ${isResizing ? 'gc-item--resizing' : ''} ${isSelected ? 'gc-item--selected' : ''}`}
      style={{
        position: 'absolute',
        transform: `translate(${renderLeft}px, ${renderTop}px)`,
        width: renderWidth,
        height: renderHeight,
        transition: isDragging || isResizing ? 'none' : 'transform 150ms ease, width 150ms ease, height 150ms ease',
        zIndex: isDragging ? 1000 : isSelected ? 1 : 0,
        userSelect: isDragging ? 'none' : undefined,
        cursor: interactionMode === 'hand' ? 'inherit' : itemDraggable ? 'grab' : 'default',
        boxSizing: 'border-box',
      }}
      onClick={handleClick}
    >
      {layoutItem.type && itemTypes?.[layoutItem.type]
        ? React.createElement(itemTypes[layoutItem.type], {
            item: layoutItem,
            children,
            isDragging,
            isResizing,
          })
        : children}

      {/* Resize handles */}
      {itemResizable &&
        handles.map((handle) => (
          <div
            key={handle}
            className={`gc-resize-handle gc-resize-handle-${handle}`}
            onPointerDown={(e) => handleResizePointerDown(handle, e)}
            style={getResizeHandleStyle(handle)}
          />
        ))}
    </div>
  );
});

function getResizeHandleStyle(handle: ResizeHandleAxis): React.CSSProperties {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 10,
    height: 10,
    zIndex: 2,
  };

  switch (handle) {
    case 'se':
      return { ...base, bottom: -5, right: -5, cursor: 'se-resize' };
    case 'sw':
      return { ...base, bottom: -5, left: -5, cursor: 'sw-resize' };
    case 'ne':
      return { ...base, top: -5, right: -5, cursor: 'ne-resize' };
    case 'nw':
      return { ...base, top: -5, left: -5, cursor: 'nw-resize' };
    case 's':
      return { ...base, bottom: -5, left: '50%', transform: 'translateX(-50%)', cursor: 's-resize' };
    case 'n':
      return { ...base, top: -5, left: '50%', transform: 'translateX(-50%)', cursor: 'n-resize' };
    case 'e':
      return { ...base, right: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'e-resize' };
    case 'w':
      return { ...base, left: -5, top: '50%', transform: 'translateY(-50%)', cursor: 'w-resize' };
    default:
      return base;
  }
}
