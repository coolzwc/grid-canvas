import React, { memo, useMemo, Children, isValidElement } from 'react';
import type { ComponentType } from 'react';
import type { ResizeHandleAxis, LayoutItem } from '@grid-canvas/core';
import { useVisibleItems } from '../hooks/useVisibleItems';
import { ItemWrapper } from './ItemWrapper';
import type { ItemComponentProps } from '../types';

export interface ItemRendererProps {
  children?: React.ReactNode;
  onlyRenderVisibleItems: boolean;
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

export const ItemRenderer = memo(function ItemRenderer({
  children,
  onlyRenderVisibleItems,
  itemTypes,
  resizeHandles,
  dragHandle,
  dragCancel,
  dragThreshold,
  draggable,
  resizable,
  onDragStart,
  onDrag,
  onDragStop,
  onResizeStart,
  onResize,
  onResizeStop,
}: ItemRendererProps) {
  const visibleIds = useVisibleItems(onlyRenderVisibleItems);

  const childMap = useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    Children.forEach(children, (child) => {
      if (isValidElement(child) && child.key != null) {
        map.set(String(child.key), child);
      }
    });
    return map;
  }, [children]);

  return (
    <>
      {visibleIds.map((id) => (
        <ItemWrapper
          key={id}
          id={id}
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
          {childMap.get(id)}
        </ItemWrapper>
      ))}
    </>
  );
});
