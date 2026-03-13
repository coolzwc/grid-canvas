import { describe, it, expect } from 'vitest';
import {
  cloneLayout,
  cloneLayoutItem,
  getLayoutItem,
  bottom,
  moveElement,
  validateLayout,
} from '../../src/grid/layout';
import type { LayoutItem, Layout } from '../../src/types';

function item(i: string, x: number, y: number, w = 1, h = 1, isStatic = false): LayoutItem {
  return { i, x, y, w, h, isStatic };
}

describe('layout', () => {
  describe('cloneLayout', () => {
    it('creates a deep copy', () => {
      const layout: Layout = [item('a', 0, 0), item('b', 1, 0)];
      const cloned = cloneLayout(layout);
      expect(cloned).toEqual(layout);
      expect(cloned).not.toBe(layout);
      expect(cloned[0]).not.toBe(layout[0]);
    });

    it('does not share references', () => {
      const layout: Layout = [item('a', 0, 0)];
      const cloned = cloneLayout(layout);
      cloned[0].x = 99;
      expect(layout[0].x).toBe(0);
    });
  });

  describe('cloneLayoutItem', () => {
    it('creates a copy of a layout item', () => {
      const a = item('a', 0, 0, 2, 3);
      const clone = cloneLayoutItem(a);
      expect(clone).toEqual(a);
      expect(clone).not.toBe(a);
    });
  });

  describe('getLayoutItem', () => {
    it('finds item by id', () => {
      const layout: Layout = [item('a', 0, 0), item('b', 1, 0)];
      expect(getLayoutItem(layout, 'b')?.i).toBe('b');
    });

    it('returns undefined for missing id', () => {
      expect(getLayoutItem([item('a', 0, 0)], 'z')).toBeUndefined();
    });
  });

  describe('bottom', () => {
    it('returns the bottom coordinate of the layout', () => {
      const layout: Layout = [
        item('a', 0, 0, 1, 2),
        item('b', 1, 3, 1, 3),
      ];
      expect(bottom(layout)).toBe(6); // 3 + 3
    });

    it('returns 0 for empty layout', () => {
      expect(bottom([])).toBe(0);
    });
  });

  describe('moveElement', () => {
    it('moves item to new position', () => {
      const layout: Layout = [item('a', 0, 0, 2, 2), item('b', 4, 0, 2, 2)];
      const result = moveElement(layout, layout[0], 2, 0, true, false, 12);
      const a = result.find((i) => i.i === 'a')!;
      expect(a.x).toBe(2);
      expect(a.y).toBe(0);
    });

    it('pushes colliding items down', () => {
      const layout: Layout = [
        item('a', 0, 0, 2, 2),
        item('b', 0, 2, 2, 2),
      ];
      const result = moveElement(layout, layout[0], 0, 1, true, false, 12);
      const a = result.find((i) => i.i === 'a')!;
      const b = result.find((i) => i.i === 'b')!;
      expect(a.y).toBe(1);
      expect(b.y).toBeGreaterThanOrEqual(a.y + a.h);
    });

    it('does not move static items', () => {
      const layout: Layout = [item('a', 0, 0, 2, 2, true)];
      const result = moveElement(layout, layout[0], 5, 5, true, false, 12);
      expect(result[0].x).toBe(0);
      expect(result[0].y).toBe(0);
    });

    it('prevents collision when preventCollision is true', () => {
      const layout: Layout = [
        item('a', 0, 0, 2, 2),
        item('b', 2, 0, 2, 2),
      ];
      const result = moveElement(layout, layout[0], 1, 0, true, true, 12);
      const a = result.find((i) => i.i === 'a')!;
      // Should not move because it would collide with b
      expect(a.x).toBe(0);
    });

    it('returns new layout instance', () => {
      const layout: Layout = [item('a', 0, 0)];
      const result = moveElement(layout, layout[0], 1, 0, true, false, 12);
      expect(result).not.toBe(layout);
    });
  });

  describe('validateLayout', () => {
    it('clamps x and y to valid range', () => {
      const layout: Layout = [{ i: 'a', x: -5, y: -3, w: 2, h: 2 }];
      const result = validateLayout(layout, 12);
      expect(result[0].x).toBe(0);
      expect(result[0].y).toBe(0);
    });

    it('clamps width to cols', () => {
      const layout: Layout = [{ i: 'a', x: 0, y: 0, w: 20, h: 1 }];
      const result = validateLayout(layout, 12);
      expect(result[0].w).toBe(12);
    });

    it('ensures minimum dimensions of 1', () => {
      const layout: Layout = [{ i: 'a', x: 0, y: 0, w: 0, h: 0 }];
      const result = validateLayout(layout, 12);
      expect(result[0].w).toBe(1);
      expect(result[0].h).toBe(1);
    });

    it('respects minW/maxW/minH/maxH', () => {
      const layout: Layout = [
        { i: 'a', x: 0, y: 0, w: 1, h: 1, minW: 2, minH: 3, maxW: 5, maxH: 4 },
      ];
      const result = validateLayout(layout, 12);
      expect(result[0].w).toBe(2);
      expect(result[0].h).toBe(3);
    });

    it('clamps x to cols - w', () => {
      const layout: Layout = [{ i: 'a', x: 11, y: 0, w: 3, h: 1 }];
      const result = validateLayout(layout, 12);
      expect(result[0].w).toBe(3);
      expect(result[0].x).toBeLessThanOrEqual(12 - result[0].w);
    });
  });
});
