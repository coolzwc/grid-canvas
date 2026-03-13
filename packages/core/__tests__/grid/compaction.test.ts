import { describe, it, expect } from 'vitest';
import { getCompactor, verticalCompactor, horizontalCompactor, noCompactor } from '../../src/grid/compaction';
import type { LayoutItem, Layout } from '../../src/types';

function item(i: string, x: number, y: number, w = 1, h = 1, isStatic = false): LayoutItem {
  return { i, x, y, w, h, isStatic };
}

describe('compaction', () => {
  describe('getCompactor', () => {
    it('returns vertical compactor', () => {
      expect(getCompactor('vertical')).toBe(verticalCompactor);
    });

    it('returns horizontal compactor', () => {
      expect(getCompactor('horizontal')).toBe(horizontalCompactor);
    });

    it('returns noCompactor for null', () => {
      expect(getCompactor(null)).toBe(noCompactor);
    });
  });

  describe('vertical compaction', () => {
    it('compacts items to top', () => {
      const layout: Layout = [
        item('a', 0, 5, 1, 1),
        item('b', 1, 3, 1, 1),
      ];
      const result = verticalCompactor.compact(layout, 12);
      expect(result.find((i) => i.i === 'a')!.y).toBe(0);
      expect(result.find((i) => i.i === 'b')!.y).toBe(0);
    });

    it('stacks items vertically when they share a column', () => {
      const layout: Layout = [
        item('a', 0, 10, 2, 1),
        item('b', 0, 20, 2, 1),
      ];
      const result = verticalCompactor.compact(layout, 12);
      expect(result.find((i) => i.i === 'a')!.y).toBe(0);
      expect(result.find((i) => i.i === 'b')!.y).toBe(1);
    });

    it('respects static items', () => {
      const layout: Layout = [
        item('static', 0, 2, 2, 1, true),
        item('a', 0, 10, 1, 1),
      ];
      const result = verticalCompactor.compact(layout, 12);
      const staticItem = result.find((i) => i.i === 'static')!;
      const aItem = result.find((i) => i.i === 'a')!;
      expect(staticItem.y).toBe(2);
      expect(aItem.y).toBeGreaterThanOrEqual(0);
    });

    it('handles y: Infinity without infinite loop (DragFromOutside pattern)', () => {
      const layout: Layout = [
        item('a', 0, 0, 1, 1),
        item('b', 0, Infinity, 1, 1),
      ];
      const result = verticalCompactor.compact(layout, 12);
      expect(Number.isFinite(result.find((i) => i.i === 'b')!.y)).toBe(true);
    });

    it('preserves original layout order', () => {
      const layout: Layout = [
        item('c', 2, 0),
        item('a', 0, 0),
        item('b', 1, 0),
      ];
      const result = verticalCompactor.compact(layout, 12);
      expect(result[0].i).toBe('c');
      expect(result[1].i).toBe('a');
      expect(result[2].i).toBe('b');
    });
  });

  describe('horizontal compaction', () => {
    it('compacts items to left', () => {
      const layout: Layout = [
        item('a', 5, 0, 1, 1),
        item('b', 8, 1, 1, 1),
      ];
      const result = horizontalCompactor.compact(layout, 12);
      expect(result.find((i) => i.i === 'a')!.x).toBe(0);
      expect(result.find((i) => i.i === 'b')!.x).toBe(0);
    });

    it('stacks items horizontally when they share a row', () => {
      const layout: Layout = [
        item('a', 10, 0, 1, 2),
        item('b', 20, 0, 1, 2),
      ];
      const result = horizontalCompactor.compact(layout, 12);
      expect(result.find((i) => i.i === 'a')!.x).toBe(0);
      expect(result.find((i) => i.i === 'b')!.x).toBe(1);
    });

    it('handles x: Infinity without infinite loop', () => {
      const layout: Layout = [
        item('a', 0, 0, 1, 1),
        item('b', Infinity, 0, 1, 1),
      ];
      const result = horizontalCompactor.compact(layout, 12);
      expect(Number.isFinite(result.find((i) => i.i === 'b')!.x)).toBe(true);
    });
  });

  describe('noCompactor', () => {
    it('returns layout unchanged', () => {
      const layout: Layout = [item('a', 5, 5)];
      const result = noCompactor.compact(layout, 12);
      expect(result).toBe(layout);
    });
  });
});
