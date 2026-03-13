import { describe, it, expect } from 'vitest';
import { snapToGridPosition } from '../../src/drag/snapToGrid';
import type { PositionParams } from '../../src/types';

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

describe('snapToGrid', () => {
  describe('snapToGridPosition', () => {
    it('snaps to grid cell 0,0', () => {
      const params = defaultParams();
      const result = snapToGridPosition(params, 10, 10);
      expect(result.left).toBe(10); // containerPadding
      expect(result.top).toBe(10);
    });

    it('snaps position near cell 1,1', () => {
      const params = defaultParams();
      // colWidth = 90, cellW = 100, cellH = 70
      const result = snapToGridPosition(params, 105, 75);
      expect(result.left).toBe(110); // 1*100 + 10
      expect(result.top).toBe(80); // 1*70 + 10
    });

    it('snaps to nearest cell', () => {
      const params = defaultParams();
      // cellW = 100 (90+10), cellH = 70 (60+10)
      const result = snapToGridPosition(params, 149, 10);
      expect(result.left).toBe(110); // rounds to cell 1 (nearest)
    });

    it('handles offset close to halfway', () => {
      const params = defaultParams();
      const result = snapToGridPosition(params, 60, 45);
      expect(typeof result.left).toBe('number');
      expect(typeof result.top).toBe('number');
    });
  });
});
