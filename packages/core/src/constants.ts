import type { GridConfig, ResizeHandleAxis } from './types';

export const DEFAULT_GRID_CONFIG: GridConfig = {
  cols: 12,
  rowHeight: 60,
  margin: [10, 10],
  containerPadding: [10, 10],
  maxRows: Infinity,
};

export const DEFAULT_COLS = 12;
export const DEFAULT_ROW_HEIGHT = 60;
export const DEFAULT_MARGIN: [number, number] = [10, 10];
export const DEFAULT_CONTAINER_PADDING: [number, number] = [10, 10];
export const DEFAULT_MAX_ROWS = Infinity;

export const DEFAULT_MIN_ZOOM = 0.1;
export const DEFAULT_MAX_ZOOM = 4;
export const DEFAULT_DRAG_THRESHOLD = 3;

export const DEFAULT_RESIZE_HANDLES: ResizeHandleAxis[] = ['se'];

export const INFINITE_EXTENT: [[number, number], [number, number]] = [
  [-Infinity, -Infinity],
  [Infinity, Infinity],
];
