import { useStoreApi } from '../contexts/GridCanvasContext';
import { transformToViewport, type Viewport, type FitViewOptions, type Layout } from '@grid-canvas/core';

/**
 * Public API hook for imperative access to the grid canvas.
 */
export function useGridCanvas() {
  const store = useStoreApi();

  return {
    getItems(): Layout {
      return store.getState().items;
    },

    setItems(items: Layout) {
      store.getState().setItems(items);
    },

    getViewport(): Viewport {
      return transformToViewport(store.getState().transform);
    },

    setViewport(viewport: Viewport) {
      const { panZoom } = store.getState();
      panZoom?.setViewport(viewport);
    },

    fitView(options?: FitViewOptions) {
      store.getState().fitView(options);
    },

    zoomIn(step = 0.2) {
      const [, , zoom] = store.getState().transform;
      store.getState().zoomTo(zoom + step);
    },

    zoomOut(step = 0.2) {
      const [, , zoom] = store.getState().transform;
      store.getState().zoomTo(Math.max(0.1, zoom - step));
    },

    panBy(dx: number, dy: number) {
      store.getState().panBy(dx, dy);
    },

    getSelectedIds(): string[] {
      return Array.from(store.getState().selectedIds);
    },

    clearSelection() {
      store.getState().clearSelection();
    },
  };
}
