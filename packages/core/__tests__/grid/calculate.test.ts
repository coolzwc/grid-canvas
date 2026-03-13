import { describe, it, expect } from 'vitest';
import {
  calcGridColWidth,
  calcGridItemWHPx,
  calcGridItemPosition,
  calcXY,
  calcWH,
} from '../../src/grid/calculate';
import type { PositionParams } from '../../src/types';

function defaultParams(overrides?: Partial<PositionParams>): PositionParams {
  return {
    margin: [10, 10],
    containerPadding: [10, 10],
    containerWidth: 1210,
    cols: 12,
    rowHeight: 60,
    maxRows: Infinity,
    ...overrides,
  };
}

describe('calculate', () => {
  describe('calcGridColWidth', () => {
    it('computes column width correctly', () => {
      const params = defaultParams();
      // (1210 - 10*11 - 10*2) / 12 = (1210 - 110 - 20) / 12 = 1080/12 = 90
      expect(calcGridColWidth(params)).toBe(90);
    });

    it('adjusts for different container widths', () => {
      const params = defaultParams({ containerWidth: 610, cols: 6 });
      // (610 - 10*5 - 10*2) / 6 = (610 - 50 - 20) / 6 = 540/6 = 90
      expect(calcGridColWidth(params)).toBe(90);
    });
  });

  describe('calcGridItemWHPx', () => {
    it('converts grid units to pixels', () => {
      // 2 units * 90px + (2-1) * 10px margin = 190
      expect(calcGridItemWHPx(2, 90, 10)).toBe(190);
    });

    it('returns 1-unit width correctly', () => {
      // 1 unit * 90px + 0 * 10px = 90
      expect(calcGridItemWHPx(1, 90, 10)).toBe(90);
    });

    it('handles non-finite values', () => {
      expect(calcGridItemWHPx(Infinity, 90, 10)).toBe(Infinity);
    });
  });

  describe('calcGridItemPosition', () => {
    it('computes correct pixel position', () => {
      const params = defaultParams();
      const pos = calcGridItemPosition(params, 0, 0, 2, 1);
      expect(pos.left).toBe(10); // containerPadding[0]
      expect(pos.top).toBe(10); // containerPadding[1]
      expect(pos.width).toBe(190); // 2*90 + 1*10
      expect(pos.height).toBe(60); // 1*60
    });

    it('computes position at x=1, y=1', () => {
      const params = defaultParams();
      const colWidth = 90;
      const pos = calcGridItemPosition(params, 1, 1, 1, 1);
      expect(pos.left).toBe(Math.round((colWidth + 10) * 1 + 10)); // 110
      expect(pos.top).toBe(Math.round((60 + 10) * 1 + 10)); // 80
    });

    it('uses drag position override', () => {
      const params = defaultParams();
      const pos = calcGridItemPosition(params, 0, 0, 1, 1, { top: 50, left: 75 });
      expect(pos.top).toBe(50);
      expect(pos.left).toBe(75);
    });

    it('uses resize position override', () => {
      const params = defaultParams();
      const pos = calcGridItemPosition(params, 0, 0, 1, 1, null, { width: 200, height: 150 });
      expect(pos.width).toBe(200);
      expect(pos.height).toBe(150);
    });
  });

  describe('calcXY', () => {
    it('converts pixel position to grid coordinates', () => {
      const params = defaultParams();
      // At x=0,y=0: left=10, top=10
      const { x, y } = calcXY(params, 10, 10, 1, 1);
      expect(x).toBe(0);
      expect(y).toBe(0);
    });

    it('converts to grid position at (1,1)', () => {
      const params = defaultParams();
      const { x, y } = calcXY(params, 80, 110, 1, 1);
      expect(x).toBe(1);
      expect(y).toBe(1);
    });

    it('clamps to valid range', () => {
      const params = defaultParams();
      const { x, y } = calcXY(params, -100, -100, 2, 2);
      expect(x).toBe(0);
      expect(y).toBe(0);
    });

    it('clamps x to cols - w', () => {
      const params = defaultParams();
      const { x } = calcXY(params, 0, 99999, 2, 1);
      expect(x).toBe(10); // 12 - 2
    });
  });

  describe('calcWH', () => {
    it('converts pixel size to grid units', () => {
      const params = defaultParams();
      const { w, h } = calcWH(params, 190, 60, 0, 0);
      expect(w).toBe(2);
      expect(h).toBe(1);
    });

    it('clamps minimum to 1', () => {
      const params = defaultParams();
      const { w, h } = calcWH(params, 5, 5, 0, 0);
      expect(w).toBe(1);
      expect(h).toBe(1);
    });

    it('clamps to cols - x', () => {
      const params = defaultParams();
      const { w } = calcWH(params, 99999, 60, 10, 0);
      expect(w).toBe(2); // 12 - 10
    });
  });

  describe('roundtrip: grid -> pixel -> grid', () => {
    it('converts back to original grid coords', () => {
      const params = defaultParams();
      const pos = calcGridItemPosition(params, 3, 2, 2, 1);
      const { x, y } = calcXY(params, pos.top, pos.left, 2, 1);
      expect(x).toBe(3);
      expect(y).toBe(2);
    });

    it('converts back to original grid size', () => {
      const params = defaultParams();
      const pos = calcGridItemPosition(params, 0, 0, 3, 2);
      const { w, h } = calcWH(params, pos.width, pos.height, 0, 0);
      expect(w).toBe(3);
      expect(h).toBe(2);
    });
  });
});
