import { describe, it, expect } from 'vitest';
import { getSizeConstraints, constrainSize } from '../../src/resize/constraints';
import type { LayoutItem } from '../../src/types';

describe('constraints', () => {
  describe('getSizeConstraints', () => {
    it('returns defaults for item without constraints', () => {
      const item: LayoutItem = { i: 'a', x: 0, y: 0, w: 2, h: 2 };
      const constraints = getSizeConstraints(item, 12);
      expect(constraints).toEqual({
        minW: 1,
        maxW: 12,
        minH: 1,
        maxH: Infinity,
      });
    });

    it('respects item-level constraints', () => {
      const item: LayoutItem = {
        i: 'a', x: 0, y: 0, w: 3, h: 3,
        minW: 2, maxW: 6, minH: 2, maxH: 8,
      };
      const constraints = getSizeConstraints(item, 12);
      expect(constraints).toEqual({
        minW: 2, maxW: 6, minH: 2, maxH: 8,
      });
    });
  });

  describe('constrainSize', () => {
    it('passes through valid size', () => {
      const result = constrainSize(3, 3, { minW: 1, maxW: 12, minH: 1, maxH: Infinity });
      expect(result).toEqual({ w: 3, h: 3 });
    });

    it('clamps to min', () => {
      const result = constrainSize(0, 0, { minW: 2, maxW: 12, minH: 2, maxH: 12 });
      expect(result).toEqual({ w: 2, h: 2 });
    });

    it('clamps to max', () => {
      const result = constrainSize(20, 20, { minW: 1, maxW: 5, minH: 1, maxH: 5 });
      expect(result).toEqual({ w: 5, h: 5 });
    });
  });
});
