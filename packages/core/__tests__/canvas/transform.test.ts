import { describe, it, expect } from 'vitest';
import {
  viewportToTransform,
  transformToViewport,
  screenToCanvas,
  canvasToScreen,
  snapPosition,
  getVisibleRect,
} from '../../src/canvas/transform';
import type { Transform, Viewport, XYPosition } from '../../src/types';

describe('transform', () => {
  describe('viewportToTransform / transformToViewport', () => {
    it('converts viewport to transform', () => {
      const viewport: Viewport = { x: 100, y: 200, zoom: 2 };
      const transform = viewportToTransform(viewport);
      expect(transform).toEqual([100, 200, 2]);
    });

    it('converts transform to viewport', () => {
      const transform: Transform = [50, 75, 1.5];
      const viewport = transformToViewport(transform);
      expect(viewport).toEqual({ x: 50, y: 75, zoom: 1.5 });
    });

    it('roundtrips correctly', () => {
      const viewport: Viewport = { x: 42, y: 99, zoom: 0.5 };
      expect(transformToViewport(viewportToTransform(viewport))).toEqual(viewport);
    });
  });

  describe('screenToCanvas', () => {
    it('converts screen to canvas at identity transform', () => {
      const point: XYPosition = { x: 100, y: 200 };
      const transform: Transform = [0, 0, 1];
      const result = screenToCanvas(point, transform);
      expect(result.x).toBe(100);
      expect(result.y).toBe(200);
    });

    it('accounts for translation', () => {
      const point: XYPosition = { x: 150, y: 250 };
      const transform: Transform = [50, 50, 1];
      const result = screenToCanvas(point, transform);
      expect(result.x).toBe(100);
      expect(result.y).toBe(200);
    });

    it('accounts for zoom', () => {
      const point: XYPosition = { x: 200, y: 200 };
      const transform: Transform = [0, 0, 2];
      const result = screenToCanvas(point, transform);
      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
    });

    it('accounts for both translation and zoom', () => {
      const point: XYPosition = { x: 300, y: 400 };
      const transform: Transform = [100, 200, 2];
      const result = screenToCanvas(point, transform);
      expect(result.x).toBe(100);
      expect(result.y).toBe(100);
    });

    it('supports snap to grid', () => {
      const point: XYPosition = { x: 57, y: 73 };
      const transform: Transform = [0, 0, 1];
      const result = screenToCanvas(point, transform, true, [10, 10]);
      expect(result.x).toBe(60);
      expect(result.y).toBe(70);
    });
  });

  describe('canvasToScreen', () => {
    it('converts canvas to screen at identity transform', () => {
      const point: XYPosition = { x: 100, y: 200 };
      const transform: Transform = [0, 0, 1];
      const result = canvasToScreen(point, transform);
      expect(result.x).toBe(100);
      expect(result.y).toBe(200);
    });

    it('applies translation and zoom', () => {
      const point: XYPosition = { x: 100, y: 100 };
      const transform: Transform = [100, 200, 2];
      const result = canvasToScreen(point, transform);
      expect(result.x).toBe(300);
      expect(result.y).toBe(400);
    });
  });

  describe('screenToCanvas <-> canvasToScreen roundtrip', () => {
    it('roundtrips correctly', () => {
      const original: XYPosition = { x: 150, y: 250 };
      const transform: Transform = [50, 100, 1.5];
      const canvas = screenToCanvas(original, transform);
      const screen = canvasToScreen(canvas, transform);
      expect(screen.x).toBeCloseTo(original.x);
      expect(screen.y).toBeCloseTo(original.y);
    });
  });

  describe('snapPosition', () => {
    it('snaps to nearest grid point', () => {
      expect(snapPosition({ x: 14, y: 27 }, [10, 10])).toEqual({ x: 10, y: 30 });
    });

    it('snaps with asymmetric grid', () => {
      expect(snapPosition({ x: 14, y: 27 }, [5, 20])).toEqual({ x: 15, y: 20 });
    });
  });

  describe('getVisibleRect', () => {
    it('returns full viewport at identity transform', () => {
      const rect = getVisibleRect(800, 600, [0, 0, 1]);
      expect(rect.x).toBeCloseTo(0);
      expect(rect.y).toBeCloseTo(0);
      expect(rect.width).toBe(800);
      expect(rect.height).toBe(600);
    });

    it('adjusts for zoom', () => {
      const rect = getVisibleRect(800, 600, [0, 0, 2]);
      expect(rect.x).toBeCloseTo(0);
      expect(rect.y).toBeCloseTo(0);
      expect(rect.width).toBe(400);
      expect(rect.height).toBe(300);
    });

    it('adjusts for translation', () => {
      const rect = getVisibleRect(800, 600, [100, 50, 1]);
      expect(rect).toEqual({ x: -100, y: -50, width: 800, height: 600 });
    });

    it('adjusts for both', () => {
      const rect = getVisibleRect(800, 600, [200, 100, 2]);
      expect(rect).toEqual({ x: -100, y: -50, width: 400, height: 300 });
    });
  });
});
