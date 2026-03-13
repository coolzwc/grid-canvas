import { describe, it, expect } from 'vitest';
import { clamp, lerp, distance } from '../../src/utils/math';

describe('math utils', () => {
  describe('clamp', () => {
    it('returns value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('clamps to min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('clamps to max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('handles equal min and max', () => {
      expect(clamp(5, 3, 3)).toBe(3);
    });
  });

  describe('lerp', () => {
    it('returns a at t=0', () => {
      expect(lerp(0, 100, 0)).toBe(0);
    });

    it('returns b at t=1', () => {
      expect(lerp(0, 100, 1)).toBe(100);
    });

    it('returns midpoint at t=0.5', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
    });

    it('works with negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });
  });

  describe('distance', () => {
    it('returns 0 for same point', () => {
      expect(distance(0, 0, 0, 0)).toBe(0);
    });

    it('computes horizontal distance', () => {
      expect(distance(0, 0, 3, 0)).toBe(3);
    });

    it('computes vertical distance', () => {
      expect(distance(0, 0, 0, 4)).toBe(4);
    });

    it('computes diagonal distance (3-4-5 triangle)', () => {
      expect(distance(0, 0, 3, 4)).toBe(5);
    });
  });
});
