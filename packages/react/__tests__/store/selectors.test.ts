import { describe, it, expect, beforeEach } from 'vitest';
import {
  transformSelector,
  transformCssSelector,
  dimensionsSelector,
  itemIdsSelector,
  activeDragSelector,
  activeResizeSelector,
  selectedIdsSelector,
  configSelector,
} from '../../src/store/selectors';
import { createGridCanvasStore } from '../../src/store/createStore';

describe('selectors', () => {
  let store: ReturnType<typeof createGridCanvasStore>;

  beforeEach(() => {
    store = createGridCanvasStore();
  });

  it('transformSelector returns transform', () => {
    store.getState().setTransform([10, 20, 1.5]);
    expect(transformSelector(store.getState())).toEqual([10, 20, 1.5]);
  });

  it('transformCssSelector returns CSS string', () => {
    store.getState().setTransform([10, 20, 1.5]);
    expect(transformCssSelector(store.getState())).toBe('translate(10px, 20px) scale(1.5)');
  });

  it('dimensionsSelector returns width/height', () => {
    store.getState().setDimensions(800, 600);
    expect(dimensionsSelector(store.getState())).toEqual({ width: 800, height: 600 });
  });

  it('itemIdsSelector returns item ids', () => {
    store.getState().setItems([
      { i: 'a', x: 0, y: 0, w: 1, h: 1 },
      { i: 'b', x: 1, y: 0, w: 1, h: 1 },
    ]);
    expect(itemIdsSelector(store.getState())).toEqual(['a', 'b']);
  });

  it('activeDragSelector returns null by default', () => {
    expect(activeDragSelector(store.getState())).toBeNull();
  });

  it('activeResizeSelector returns null by default', () => {
    expect(activeResizeSelector(store.getState())).toBeNull();
  });

  it('selectedIdsSelector returns empty set by default', () => {
    const ids = selectedIdsSelector(store.getState());
    expect(ids.size).toBe(0);
  });

  it('configSelector returns config values', () => {
    const config = configSelector(store.getState());
    expect(config.cols).toBe(12);
    expect(config.rowHeight).toBe(60);
    expect(config.draggable).toBe(true);
    expect(config.resizable).toBe(true);
  });
});
