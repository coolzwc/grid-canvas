import type { Layout, LayoutItem, InternalItem, PositionParams, PixelPosition } from '../types';
import { calcGridItemPosition } from '../grid/calculate';

/**
 * Convert user layout items to internal items with pixel positions.
 */
export function adoptItems(
  layout: Layout,
  params: PositionParams
): Map<string, InternalItem> {
  const lookup = new Map<string, InternalItem>();

  for (const item of layout) {
    const pixelPosition = calcGridItemPosition(
      params,
      item.x,
      item.y,
      item.w,
      item.h
    );

    lookup.set(item.i, {
      ...item,
      pixelPosition,
      isDragging: false,
      isResizing: false,
    });
  }

  return lookup;
}

/**
 * Get all internal items as pixel-positioned rects (for viewport culling).
 */
export function getItemRects(
  itemLookup: Map<string, InternalItem>
): Array<{ id: string; rect: PixelPosition }> {
  const rects: Array<{ id: string; rect: PixelPosition }> = [];
  for (const [id, item] of itemLookup) {
    rects.push({ id, rect: item.pixelPosition });
  }
  return rects;
}
