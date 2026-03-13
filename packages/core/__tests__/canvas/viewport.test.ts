import { describe, it, expect } from 'vitest';
import {
  getViewportForBounds,
  rectsOverlap,
  getBoundsOfRects,
} from '../../src/canvas/viewport';
import type { Rect } from '../../src/types';

describe('viewport', () => {
  describe('getViewportForBounds', () => {
    it('fits bounds centered in viewport', () => {
      const bounds: Rect = { x: 0, y: 0, width: 400, height: 300 };
      const vp = getViewportForBounds(bounds, 800, 600, 0.1, 4, 0.1);
      expect(vp.zoom).toBeGreaterThan(0);
      expect(vp.zoom).toBeLessThanOrEqual(4);
    });

    it('centers the bounds', () => {
      const bounds: Rect = { x: 100, y: 100, width: 200, height: 200 };
      const vp = getViewportForBounds(bounds, 800, 600, 0.1, 4, 0);
      const centerCanvasX = 100 + 100; // bounds center x
      const centerCanvasY = 100 + 100; // bounds center y
      const screenCenterX = centerCanvasX * vp.zoom + vp.x;
      const screenCenterY = centerCanvasY * vp.zoom + vp.y;
      expect(screenCenterX).toBeCloseTo(400); // viewport center
      expect(screenCenterY).toBeCloseTo(300);
    });

    it('clamps zoom to minZoom', () => {
      const bounds: Rect = { x: 0, y: 0, width: 10000, height: 10000 };
      const vp = getViewportForBounds(bounds, 800, 600, 0.5, 4, 0);
      expect(vp.zoom).toBe(0.5);
    });

    it('clamps zoom to maxZoom', () => {
      const bounds: Rect = { x: 0, y: 0, width: 10, height: 10 };
      const vp = getViewportForBounds(bounds, 800, 600, 0.1, 2, 0);
      expect(vp.zoom).toBe(2);
    });

    it('handles zero-size bounds gracefully', () => {
      const bounds: Rect = { x: 50, y: 50, width: 0, height: 0 };
      const vp = getViewportForBounds(bounds, 800, 600, 0.1, 4, 0.1);
      expect(Number.isFinite(vp.zoom)).toBe(true);
      expect(Number.isFinite(vp.x)).toBe(true);
      expect(Number.isFinite(vp.y)).toBe(true);
    });

    it('applies padding correctly', () => {
      const bounds: Rect = { x: 0, y: 0, width: 800, height: 600 };
      const vpNoPad = getViewportForBounds(bounds, 800, 600, 0.1, 4, 0);
      const vpWithPad = getViewportForBounds(bounds, 800, 600, 0.1, 4, 0.2);
      expect(vpWithPad.zoom).toBeLessThan(vpNoPad.zoom);
    });
  });

  describe('rectsOverlap', () => {
    it('detects overlapping rects', () => {
      const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
      const b: Rect = { x: 50, y: 50, width: 100, height: 100 };
      expect(rectsOverlap(a, b)).toBe(true);
    });

    it('returns false for adjacent rects', () => {
      const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
      const b: Rect = { x: 100, y: 0, width: 100, height: 100 };
      expect(rectsOverlap(a, b)).toBe(false);
    });

    it('returns false for distant rects', () => {
      const a: Rect = { x: 0, y: 0, width: 10, height: 10 };
      const b: Rect = { x: 500, y: 500, width: 10, height: 10 };
      expect(rectsOverlap(a, b)).toBe(false);
    });

    it('detects containment', () => {
      const a: Rect = { x: 0, y: 0, width: 100, height: 100 };
      const b: Rect = { x: 10, y: 10, width: 20, height: 20 };
      expect(rectsOverlap(a, b)).toBe(true);
    });
  });

  describe('getBoundsOfRects', () => {
    it('returns zero rect for empty array', () => {
      expect(getBoundsOfRects([])).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });

    it('returns single rect bounds', () => {
      const rect: Rect = { x: 10, y: 20, width: 30, height: 40 };
      expect(getBoundsOfRects([rect])).toEqual(rect);
    });

    it('computes bounding box of multiple rects', () => {
      const rects: Rect[] = [
        { x: 0, y: 0, width: 50, height: 50 },
        { x: 100, y: 100, width: 50, height: 50 },
      ];
      expect(getBoundsOfRects(rects)).toEqual({
        x: 0, y: 0, width: 150, height: 150,
      });
    });

    it('handles negative coordinates', () => {
      const rects: Rect[] = [
        { x: -50, y: -50, width: 100, height: 100 },
        { x: 0, y: 0, width: 50, height: 50 },
      ];
      expect(getBoundsOfRects(rects)).toEqual({
        x: -50, y: -50, width: 100, height: 100,
      });
    });
  });
});
