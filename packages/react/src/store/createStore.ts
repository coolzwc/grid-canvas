import { createStore as zustandCreateStore } from 'zustand';
import type { GridCanvasState } from '../types';
import { getInitialState, type InitialStateOptions } from './initialState';
import {
  adoptItems,
  moveElement,
  getCompactor,
  getViewportForBounds,
  getBoundsOfRects,
  calcGridItemPosition,
  calcGridColWidth,
  type PositionParams,
  type Layout,
  type Transform,
  type DragState,
  type ResizeState,
  type FitViewOptions,
  type PanZoomInstance,
} from '@grid-canvas/core';

export type GridCanvasStore = ReturnType<typeof createGridCanvasStore>;

export function createGridCanvasStore(options: InitialStateOptions = {}) {
  return zustandCreateStore<GridCanvasState>((set, get) => {
    function getPositionParams(): PositionParams {
      const s = get();
      const containerWidth =
        s.width > 0
          ? s.width
          : s.cols * (s.rowHeight + s.margin[0]) + s.containerPadding[0] * 2;
      return {
        margin: s.margin,
        containerPadding: s.containerPadding,
        containerWidth,
        cols: s.cols,
        rowHeight: s.rowHeight,
        maxRows: s.maxRows,
      };
    }

    function rebuildLookup(items: Layout) {
      const params = getPositionParams();
      return adoptItems(items, params);
    }

    return {
      ...getInitialState(options),

      getPositionParams,

      setItems(items: Layout) {
        const itemLookup = rebuildLookup(items);
        set({ items, itemLookup });
      },

      updateLayout(layout: Layout) {
        const compactor = getCompactor(get().compactType);
        const compacted = compactor.compact(layout, get().cols);
        const itemLookup = rebuildLookup(compacted);
        set({ items: compacted, itemLookup });
      },

      setTransform(transform: Transform) {
        set({ transform });
      },

      setDimensions(width: number, height: number) {
        set({ width, height });
        // Recompute pixel positions with new width
        const s = get();
        if (s.items.length > 0) {
          const itemLookup = rebuildLookup(s.items);
          set({ itemLookup });
        }
      },

      setPanZoom(panZoom: PanZoomInstance | null) {
        set({ panZoom });
      },

      setDomNode(node: HTMLDivElement) {
        set({ domNode: node });
      },

      startDrag(drag: DragState) {
        set({ activeDrag: drag });
      },

      updateDrag(x: number, y: number, pixelLeft?: number, pixelTop?: number) {
        const s = get();
        const drag = s.activeDrag;
        if (!drag) return;
        const draggedItem = s.items.find((item) => item.i === drag.itemId);
        if (!draggedItem) return;

        const newDrag = {
          ...drag,
          x,
          y,
          pixelLeft: pixelLeft ?? drag.pixelLeft,
          pixelTop: pixelTop ?? drag.pixelTop,
        };
        const newLayout = moveElement(
          s.items,
          { ...draggedItem, x, y },
          x,
          y,
          true,
          s.preventCollision,
          s.cols
        );
        const compactor = getCompactor(s.compactType);
        const compacted = compactor.compact(newLayout, s.cols);
        const itemLookup = rebuildLookup(compacted);
        set({ activeDrag: newDrag, items: compacted, itemLookup });
      },

      endDrag() {
        set({ activeDrag: null });
      },

      startResize(resize: ResizeState) {
        set({ activeResize: resize });
      },

      updateResize(w: number, h: number, x?: number, y?: number, pixel?: { width: number; height: number; left: number; top: number }) {
        const s = get();
        if (!s.activeResize) return;

        const newResize = {
          ...s.activeResize,
          w,
          h,
          ...(pixel ? {
            pixelWidth: pixel.width,
            pixelHeight: pixel.height,
            pixelLeft: pixel.left,
            pixelTop: pixel.top,
          } : {}),
        };
        const newItems = s.items.map((item) => {
          if (item.i !== newResize.itemId) return item;
          const updated = { ...item, w, h };
          if (x !== undefined) updated.x = x;
          if (y !== undefined) updated.y = y;
          return updated;
        });
        const compactor = getCompactor(s.compactType);
        const compacted = compactor.compact(newItems, s.cols);
        const itemLookup = rebuildLookup(compacted);
        set({ activeResize: newResize, items: compacted, itemLookup });
      },

      endResize() {
        set({ activeResize: null });
      },

      selectItem(id: string, multi = false) {
        const s = get();
        const wasSelected = s.selectedIds.has(id);

        if (multi) {
          const newSelected = new Set(s.selectedIds);
          if (wasSelected) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
          set({ selectedIds: newSelected });
        } else {
          // Single selection: toggle off if already selected, else select only this
          set({ selectedIds: wasSelected ? new Set() : new Set([id]) });
        }
      },

      clearSelection() {
        set({ selectedIds: new Set() });
      },

      setInteractionMode(mode) {
        set({ interactionMode: mode });
      },

      panBy(dx: number, dy: number) {
        const s = get();
        if (!s.panZoom) return;
        const [tx, ty, zoom] = s.transform;
        s.panZoom.setViewport({ x: tx + dx, y: ty + dy, zoom });
      },

      zoomTo(zoom: number, center?: { x: number; y: number }) {
        const s = get();
        if (!s.panZoom) return;
        const vp = s.panZoom.getViewport();
        if (center) {
          const x = center.x - (center.x - vp.x) * (zoom / vp.zoom);
          const y = center.y - (center.y - vp.y) * (zoom / vp.zoom);
          s.panZoom.setViewport({ x, y, zoom }, { duration: 200 });
        } else {
          s.panZoom.setViewport({ ...vp, zoom }, { duration: 200 });
        }
      },

      fitView(options?: FitViewOptions) {
        const s = get();
        if (!s.panZoom || s.items.length === 0) return;

        const params = getPositionParams();
        const rects = s.items.map((item) => {
          const pos = calcGridItemPosition(params, item.x, item.y, item.w, item.h);
          return { x: pos.left, y: pos.top, width: pos.width, height: pos.height };
        });

        const bounds = getBoundsOfRects(rects);
        const viewport = getViewportForBounds(
          bounds,
          s.width,
          s.height,
          options?.minZoom ?? 0.1,
          options?.maxZoom ?? 4,
          options?.padding ?? 0.1
        );

        s.panZoom.setViewport(viewport, { duration: options?.duration ?? 300 });
      },
    };
  });
}
