import { describe, it, expect } from 'vitest';
import { setTransformStyle, setTopLeftStyle } from '../../src/utils/dom';

describe('dom utils', () => {
  describe('setTransformStyle', () => {
    it('returns CSS transform positioning', () => {
      const style = setTransformStyle(100, 200, 300, 150);
      expect(style.transform).toBe('translate(200px, 100px)');
      expect(style.width).toBe('300px');
      expect(style.height).toBe('150px');
      expect(style.position).toBe('absolute');
      expect(style.top).toBeUndefined();
      expect(style.left).toBeUndefined();
    });
  });

  describe('setTopLeftStyle', () => {
    it('returns top/left positioning', () => {
      const style = setTopLeftStyle(100, 200, 300, 150);
      expect(style.top).toBe('100px');
      expect(style.left).toBe('200px');
      expect(style.width).toBe('300px');
      expect(style.height).toBe('150px');
      expect(style.position).toBe('absolute');
      expect(style.transform).toBeUndefined();
    });
  });
});
