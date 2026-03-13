import { describe, it, expect } from 'vitest';
import { sortLayoutItemsByRowCol, sortLayoutItemsByColRow } from '../../src/grid/sort';
import type { LayoutItem } from '../../src/types';

function item(i: string, x: number, y: number): LayoutItem {
  return { i, x, y, w: 1, h: 1 };
}

describe('sort', () => {
  describe('sortLayoutItemsByRowCol', () => {
    it('sorts by y first, then x', () => {
      const items = [item('c', 2, 1), item('a', 0, 0), item('b', 1, 0), item('d', 0, 1)];
      items.sort(sortLayoutItemsByRowCol);
      expect(items.map((i) => i.i)).toEqual(['a', 'b', 'd', 'c']);
    });

    it('handles equal positions', () => {
      const items = [item('a', 0, 0), item('b', 0, 0)];
      items.sort(sortLayoutItemsByRowCol);
      expect(items.map((i) => i.i)).toEqual(['a', 'b']);
    });
  });

  describe('sortLayoutItemsByColRow', () => {
    it('sorts by x first, then y', () => {
      const items = [item('c', 1, 0), item('a', 0, 0), item('b', 0, 1), item('d', 1, 1)];
      items.sort(sortLayoutItemsByColRow);
      expect(items.map((i) => i.i)).toEqual(['a', 'b', 'c', 'd']);
    });
  });
});
