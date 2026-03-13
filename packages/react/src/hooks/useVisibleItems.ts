import { useMemo } from 'react';
import { useStore } from './useStore';
import { getVisibleRect, rectsOverlap, type Rect } from '@grid-canvas/core';

export function useVisibleItems(onlyVisible: boolean): string[] {
  const transform = useStore((s) => s.transform);
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);
  const itemLookup = useStore((s) => s.itemLookup);
  const activeDragId = useStore((s) => s.activeDrag?.itemId ?? null);
  const activeResizeId = useStore((s) => s.activeResize?.itemId ?? null);

  return useMemo(() => {
    if (!onlyVisible || width === 0 || height === 0) {
      return Array.from(itemLookup.keys());
    }

    const visibleRect = getVisibleRect(width, height, transform);
    const ids: string[] = [];

    for (const [id, item] of itemLookup) {
      const itemRect: Rect = {
        x: item.pixelPosition.left,
        y: item.pixelPosition.top,
        width: item.pixelPosition.width,
        height: item.pixelPosition.height,
      };

      if (rectsOverlap(visibleRect, itemRect)) {
        ids.push(id);
      }
    }

    // Always include actively dragged/resized items even if outside viewport
    if (activeDragId && !ids.includes(activeDragId) && itemLookup.has(activeDragId)) {
      ids.push(activeDragId);
    }
    if (activeResizeId && !ids.includes(activeResizeId) && itemLookup.has(activeResizeId)) {
      ids.push(activeResizeId);
    }

    return ids;
  }, [onlyVisible, transform, width, height, itemLookup, activeDragId, activeResizeId]);
}
