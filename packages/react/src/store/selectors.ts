import type { GridCanvasState } from '../types';
import type { Transform, InternalItem } from '@grid-canvas/core';

export const transformSelector = (s: GridCanvasState): Transform => s.transform;

export const transformCssSelector = (s: GridCanvasState): string => {
  const [x, y, zoom] = s.transform;
  return `translate(${x}px, ${y}px) scale(${zoom})`;
};

export const dimensionsSelector = (s: GridCanvasState) => ({
  width: s.width,
  height: s.height,
});

export const itemIdsSelector = (s: GridCanvasState): string[] =>
  s.items.map((item) => item.i);

export const itemLookupSelector = (
  s: GridCanvasState
): Map<string, InternalItem> => s.itemLookup;

export const activeDragSelector = (s: GridCanvasState) => s.activeDrag;

export const activeResizeSelector = (s: GridCanvasState) => s.activeResize;

export const selectedIdsSelector = (s: GridCanvasState) => s.selectedIds;

export const configSelector = (s: GridCanvasState) => ({
  cols: s.cols,
  rowHeight: s.rowHeight,
  margin: s.margin,
  containerPadding: s.containerPadding,
  maxRows: s.maxRows,
  compactType: s.compactType,
  draggable: s.draggable,
  resizable: s.resizable,
});
