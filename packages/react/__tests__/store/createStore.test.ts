import { describe, it, expect, beforeEach } from 'vitest';
import { createGridCanvasStore } from '../../src/store/createStore';
import type { Layout } from '@grid-canvas/core';

describe('createGridCanvasStore', () => {
  let store: ReturnType<typeof createGridCanvasStore>;

  beforeEach(() => {
    store = createGridCanvasStore({
      cols: 12,
      rowHeight: 60,
      margin: [10, 10],
      containerPadding: [10, 10],
    });
  });

  describe('initial state', () => {
    it('has empty items', () => {
      expect(store.getState().items).toEqual([]);
    });

    it('has empty item lookup', () => {
      expect(store.getState().itemLookup.size).toBe(0);
    });

    it('has default transform', () => {
      expect(store.getState().transform).toEqual([0, 0, 1]);
    });

    it('has no active drag or resize', () => {
      expect(store.getState().activeDrag).toBeNull();
      expect(store.getState().activeResize).toBeNull();
    });

    it('has correct config', () => {
      const s = store.getState();
      expect(s.cols).toBe(12);
      expect(s.rowHeight).toBe(60);
      expect(s.margin).toEqual([10, 10]);
      expect(s.containerPadding).toEqual([10, 10]);
    });
  });

  describe('setItems', () => {
    it('sets items and rebuilds lookup', () => {
      const items: Layout = [
        { i: 'a', x: 0, y: 0, w: 2, h: 1 },
        { i: 'b', x: 2, y: 0, w: 1, h: 1 },
      ];
      store.getState().setItems(items);
      expect(store.getState().items).toEqual(items);
      expect(store.getState().itemLookup.size).toBe(2);
    });
  });

  describe('updateLayout', () => {
    it('compacts and sets items', () => {
      const items: Layout = [
        { i: 'a', x: 0, y: 5, w: 1, h: 1 },
        { i: 'b', x: 1, y: 10, w: 1, h: 1 },
      ];
      store.getState().updateLayout(items);
      const s = store.getState();
      expect(s.items.find((i) => i.i === 'a')!.y).toBe(0);
      expect(s.items.find((i) => i.i === 'b')!.y).toBe(0);
    });

    it('handles items with y: Infinity', () => {
      const items: Layout = [
        { i: 'a', x: 0, y: 0, w: 1, h: 1 },
        { i: 'b', x: 0, y: Infinity, w: 1, h: 1 },
      ];
      store.getState().updateLayout(items);
      const b = store.getState().items.find((i) => i.i === 'b')!;
      expect(Number.isFinite(b.y)).toBe(true);
    });
  });

  describe('setTransform', () => {
    it('updates transform', () => {
      store.getState().setTransform([100, 200, 2]);
      expect(store.getState().transform).toEqual([100, 200, 2]);
    });
  });

  describe('setDimensions', () => {
    it('updates dimensions', () => {
      store.getState().setDimensions(1200, 800);
      expect(store.getState().width).toBe(1200);
      expect(store.getState().height).toBe(800);
    });

    it('recomputes pixel positions on dimension change', () => {
      const items: Layout = [{ i: 'a', x: 0, y: 0, w: 1, h: 1 }];
      store.getState().setItems(items);
      const posBefore = store.getState().itemLookup.get('a')!.pixelPosition;

      store.getState().setDimensions(2400, 800);
      const posAfter = store.getState().itemLookup.get('a')!.pixelPosition;
      expect(posAfter.width).toBeGreaterThan(posBefore.width);
    });
  });

  describe('drag lifecycle', () => {
    beforeEach(() => {
      store.getState().setItems([
        { i: 'a', x: 0, y: 0, w: 2, h: 2 },
        { i: 'b', x: 4, y: 0, w: 2, h: 2 },
      ]);
    });

    it('startDrag sets activeDrag', () => {
      store.getState().startDrag({
        itemId: 'a', x: 0, y: 0, originalX: 0, originalY: 0, offsetX: 0, offsetY: 0, pixelLeft: 0, pixelTop: 0,
      });
      expect(store.getState().activeDrag?.itemId).toBe('a');
    });

    it('updateDrag moves item', () => {
      store.getState().startDrag({
        itemId: 'a', x: 0, y: 0, originalX: 0, originalY: 0, offsetX: 0, offsetY: 0, pixelLeft: 0, pixelTop: 0,
      });
      store.getState().updateDrag(3, 0);
      const a = store.getState().items.find((i) => i.i === 'a')!;
      expect(a.x).toBe(3);
    });

    it('updateDrag stores continuous pixel position', () => {
      store.getState().startDrag({
        itemId: 'a', x: 0, y: 0, originalX: 0, originalY: 0, offsetX: 0, offsetY: 0, pixelLeft: 0, pixelTop: 0,
      });
      store.getState().updateDrag(1, 1, 55.5, 78.3);
      const drag = store.getState().activeDrag!;
      expect(drag.pixelLeft).toBe(55.5);
      expect(drag.pixelTop).toBe(78.3);
    });

    it('updateDrag does nothing without activeDrag', () => {
      const itemsBefore = store.getState().items;
      store.getState().updateDrag(3, 0);
      expect(store.getState().items).toBe(itemsBefore);
    });

    it('endDrag clears activeDrag', () => {
      store.getState().startDrag({
        itemId: 'a', x: 0, y: 0, originalX: 0, originalY: 0, offsetX: 0, offsetY: 0, pixelLeft: 0, pixelTop: 0,
      });
      store.getState().endDrag();
      expect(store.getState().activeDrag).toBeNull();
    });
  });

  describe('resize lifecycle', () => {
    beforeEach(() => {
      store.getState().setItems([{ i: 'a', x: 0, y: 0, w: 2, h: 2 }]);
    });

    const resizeBase = { pixelWidth: 200, pixelHeight: 200, pixelLeft: 0, pixelTop: 0 };

    it('startResize sets activeResize', () => {
      store.getState().startResize({
        itemId: 'a', w: 2, h: 2, originalW: 2, originalH: 2, handle: 'se', ...resizeBase,
      });
      expect(store.getState().activeResize?.itemId).toBe('a');
    });

    it('updateResize changes item size', () => {
      store.getState().startResize({
        itemId: 'a', w: 2, h: 2, originalW: 2, originalH: 2, handle: 'se', ...resizeBase,
      });
      store.getState().updateResize(4, 3);
      const a = store.getState().items.find((i) => i.i === 'a')!;
      expect(a.w).toBe(4);
      expect(a.h).toBe(3);
    });

    it('updateResize stores continuous pixel dimensions', () => {
      store.getState().startResize({
        itemId: 'a', w: 2, h: 2, originalW: 2, originalH: 2, handle: 'se', ...resizeBase,
      });
      store.getState().updateResize(3, 3, undefined, undefined, { width: 310.5, height: 250.7, left: 0, top: 0 });
      const resize = store.getState().activeResize!;
      expect(resize.pixelWidth).toBe(310.5);
      expect(resize.pixelHeight).toBe(250.7);
    });

    it('updateResize with x/y updates position (for w/n handles)', () => {
      const noCompactStore = createGridCanvasStore({
        cols: 12, rowHeight: 60, margin: [10, 10], containerPadding: [10, 10],
      });
      noCompactStore.setState({ compactType: null });
      noCompactStore.getState().setItems([{ i: 'a', x: 2, y: 2, w: 3, h: 3 }]);
      noCompactStore.getState().startResize({
        itemId: 'a', w: 3, h: 3, originalW: 3, originalH: 3, handle: 'nw', ...resizeBase,
      });
      noCompactStore.getState().updateResize(4, 4, 1, 1);
      const a = noCompactStore.getState().items.find((i) => i.i === 'a')!;
      expect(a.x).toBe(1);
      expect(a.y).toBe(1);
      expect(a.w).toBe(4);
      expect(a.h).toBe(4);
    });

    it('updateResize does nothing without activeResize', () => {
      const itemsBefore = store.getState().items;
      store.getState().updateResize(4, 3);
      expect(store.getState().items).toBe(itemsBefore);
    });

    it('endResize clears activeResize', () => {
      store.getState().startResize({
        itemId: 'a', w: 2, h: 2, originalW: 2, originalH: 2, handle: 'se', ...resizeBase,
      });
      store.getState().endResize();
      expect(store.getState().activeResize).toBeNull();
    });
  });

  describe('selection', () => {
    it('selectItem adds to selection', () => {
      store.getState().selectItem('a');
      expect(store.getState().selectedIds.has('a')).toBe(true);
    });

    it('selectItem toggles single selection', () => {
      store.getState().selectItem('a');
      store.getState().selectItem('a');
      expect(store.getState().selectedIds.has('a')).toBe(false);
    });

    it('selectItem with multi=true accumulates', () => {
      store.getState().selectItem('a');
      store.getState().selectItem('b', true);
      expect(store.getState().selectedIds.has('a')).toBe(true);
      expect(store.getState().selectedIds.has('b')).toBe(true);
    });

    it('selectItem with multi=false replaces', () => {
      store.getState().selectItem('a');
      store.getState().selectItem('b', false);
      expect(store.getState().selectedIds.has('a')).toBe(false);
      expect(store.getState().selectedIds.has('b')).toBe(true);
    });

    it('clearSelection removes all', () => {
      store.getState().selectItem('a');
      store.getState().selectItem('b', true);
      store.getState().clearSelection();
      expect(store.getState().selectedIds.size).toBe(0);
    });
  });

  describe('getPositionParams', () => {
    it('returns correct params', () => {
      store.getState().setDimensions(1210, 800);
      const params = store.getState().getPositionParams();
      expect(params.cols).toBe(12);
      expect(params.rowHeight).toBe(60);
      expect(params.containerWidth).toBe(1210);
      expect(params.margin).toEqual([10, 10]);
      expect(params.containerPadding).toEqual([10, 10]);
    });

    it('uses fallback width when container width is 0', () => {
      const params = store.getState().getPositionParams();
      expect(params.containerWidth).toBeGreaterThan(0);
    });
  });
});
