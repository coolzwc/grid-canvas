import { describe, it, expect } from 'vitest';
import { adoptItems, getItemRects } from '../../src/utils/store';
import type { PositionParams, Layout } from '../../src/types';

function defaultParams(): PositionParams {
  return {
    margin: [10, 10],
    containerPadding: [10, 10],
    containerWidth: 1210,
    cols: 12,
    rowHeight: 60,
    maxRows: Infinity,
  };
}

describe('store utils', () => {
  describe('adoptItems', () => {
    it('creates a Map from layout', () => {
      const layout: Layout = [
        { i: 'a', x: 0, y: 0, w: 2, h: 1 },
        { i: 'b', x: 2, y: 0, w: 1, h: 1 },
      ];
      const result = adoptItems(layout, defaultParams());
      expect(result.size).toBe(2);
      expect(result.has('a')).toBe(true);
      expect(result.has('b')).toBe(true);
    });

    it('computes pixel positions', () => {
      const layout: Layout = [{ i: 'a', x: 0, y: 0, w: 1, h: 1 }];
      const result = adoptItems(layout, defaultParams());
      const item = result.get('a')!;
      expect(item.pixelPosition.left).toBe(10);
      expect(item.pixelPosition.top).toBe(10);
      expect(item.pixelPosition.width).toBe(90);
      expect(item.pixelPosition.height).toBe(60);
    });

    it('sets isDragging and isResizing to false', () => {
      const layout: Layout = [{ i: 'a', x: 0, y: 0, w: 1, h: 1 }];
      const result = adoptItems(layout, defaultParams());
      const item = result.get('a')!;
      expect(item.isDragging).toBe(false);
      expect(item.isResizing).toBe(false);
    });

    it('handles empty layout', () => {
      const result = adoptItems([], defaultParams());
      expect(result.size).toBe(0);
    });

    it('last item wins on duplicate ids', () => {
      const layout: Layout = [
        { i: 'a', x: 0, y: 0, w: 1, h: 1 },
        { i: 'a', x: 5, y: 5, w: 2, h: 2 },
      ];
      const result = adoptItems(layout, defaultParams());
      expect(result.size).toBe(1);
      expect(result.get('a')!.x).toBe(5);
    });
  });

  describe('getItemRects', () => {
    it('returns array of rects', () => {
      const layout: Layout = [
        { i: 'a', x: 0, y: 0, w: 1, h: 1 },
        { i: 'b', x: 1, y: 0, w: 1, h: 1 },
      ];
      const lookup = adoptItems(layout, defaultParams());
      const rects = getItemRects(lookup);
      expect(rects).toHaveLength(2);
      expect(rects[0].id).toBeDefined();
      expect(rects[0].rect).toHaveProperty('top');
      expect(rects[0].rect).toHaveProperty('left');
      expect(rects[0].rect).toHaveProperty('width');
      expect(rects[0].rect).toHaveProperty('height');
    });
  });
});
