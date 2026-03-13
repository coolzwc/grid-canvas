import { describe, it, expect } from 'vitest';
import { collides, getFirstCollision, getAllCollisions } from '../../src/grid/collision';
import type { LayoutItem, Layout } from '../../src/types';

function item(i: string, x: number, y: number, w: number, h: number): LayoutItem {
  return { i, x, y, w, h };
}

describe('collision', () => {
  describe('collides (AABB)', () => {
    it('returns false for same item', () => {
      const a = item('a', 0, 0, 2, 2);
      expect(collides(a, a)).toBe(false);
    });

    it('detects overlap', () => {
      const a = item('a', 0, 0, 2, 2);
      const b = item('b', 1, 1, 2, 2);
      expect(collides(a, b)).toBe(true);
    });

    it('returns false when items are adjacent horizontally', () => {
      const a = item('a', 0, 0, 2, 2);
      const b = item('b', 2, 0, 2, 2);
      expect(collides(a, b)).toBe(false);
    });

    it('returns false when items are adjacent vertically', () => {
      const a = item('a', 0, 0, 2, 2);
      const b = item('b', 0, 2, 2, 2);
      expect(collides(a, b)).toBe(false);
    });

    it('returns false for non-overlapping items', () => {
      const a = item('a', 0, 0, 1, 1);
      const b = item('b', 5, 5, 1, 1);
      expect(collides(a, b)).toBe(false);
    });

    it('detects partial overlap from left', () => {
      const a = item('a', 0, 0, 3, 3);
      const b = item('b', 2, 0, 3, 3);
      expect(collides(a, b)).toBe(true);
    });

    it('detects full containment', () => {
      const a = item('a', 0, 0, 4, 4);
      const b = item('b', 1, 1, 1, 1);
      expect(collides(a, b)).toBe(true);
    });
  });

  describe('getFirstCollision', () => {
    it('returns undefined for empty layout', () => {
      expect(getFirstCollision([], item('a', 0, 0, 1, 1))).toBeUndefined();
    });

    it('returns first colliding item', () => {
      const layout: Layout = [
        item('a', 0, 0, 2, 2),
        item('b', 1, 1, 2, 2),
        item('c', 5, 5, 1, 1),
      ];
      const test = item('t', 1, 0, 2, 2);
      const result = getFirstCollision(layout, test);
      expect(result?.i).toBe('a');
    });

    it('returns undefined when no collision', () => {
      const layout: Layout = [item('a', 0, 0, 1, 1)];
      const test = item('t', 5, 5, 1, 1);
      expect(getFirstCollision(layout, test)).toBeUndefined();
    });
  });

  describe('getAllCollisions', () => {
    it('returns all colliding items', () => {
      const layout: Layout = [
        item('a', 0, 0, 3, 3),
        item('b', 2, 2, 3, 3),
        item('c', 10, 10, 1, 1),
      ];
      const test = item('t', 1, 1, 3, 3);
      const results = getAllCollisions(layout, test);
      expect(results.map((r) => r.i).sort()).toEqual(['a', 'b']);
    });

    it('returns empty array when none collide', () => {
      const layout: Layout = [item('a', 0, 0, 1, 1)];
      const test = item('t', 5, 5, 1, 1);
      expect(getAllCollisions(layout, test)).toEqual([]);
    });
  });
});
