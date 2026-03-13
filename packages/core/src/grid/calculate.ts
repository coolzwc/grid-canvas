import type { PositionParams, PixelPosition } from '../types';
import { clamp } from '../utils/math';

/**
 * Compute the width of a single grid column in pixels.
 */
export function calcGridColWidth(params: PositionParams): number {
  const { containerWidth, margin, containerPadding, cols } = params;
  return (
    (containerWidth - margin[0] * (cols - 1) - containerPadding[0] * 2) / cols
  );
}

/**
 * Convert a grid width/height unit to pixels.
 * e.g., w=2, colWidth=100, margin=10  →  2*100 + (2-1)*10 = 210
 */
export function calcGridItemWHPx(
  gridUnits: number,
  colOrRowSize: number,
  marginPx: number
): number {
  if (!Number.isFinite(gridUnits)) return gridUnits;
  return Math.round(
    colOrRowSize * gridUnits + Math.max(0, gridUnits - 1) * marginPx
  );
}

/**
 * Full pixel position from grid coordinates.
 */
export function calcGridItemPosition(
  params: PositionParams,
  x: number,
  y: number,
  w: number,
  h: number,
  dragPosition?: { top: number; left: number } | null,
  resizePosition?: { width: number; height: number } | null
): PixelPosition {
  const { margin, containerPadding, rowHeight } = params;
  const colWidth = calcGridColWidth(params);

  const width = resizePosition
    ? Math.round(resizePosition.width)
    : calcGridItemWHPx(w, colWidth, margin[0]);
  const height = resizePosition
    ? Math.round(resizePosition.height)
    : calcGridItemWHPx(h, rowHeight, margin[1]);

  const top = dragPosition
    ? Math.round(dragPosition.top)
    : Math.round((rowHeight + margin[1]) * y + containerPadding[1]);
  const left = dragPosition
    ? Math.round(dragPosition.left)
    : Math.round((colWidth + margin[0]) * x + containerPadding[0]);

  return { top, left, width, height };
}

/**
 * Convert pixel coordinates back to grid units (x, y).
 */
export function calcXY(
  params: PositionParams,
  top: number,
  left: number,
  w: number,
  h: number
): { x: number; y: number } {
  const { margin, containerPadding, rowHeight, cols, maxRows } = params;
  const colWidth = calcGridColWidth(params);

  let x = Math.round(
    (left - containerPadding[0]) / (colWidth + margin[0])
  );
  let y = Math.round(
    (top - containerPadding[1]) / (rowHeight + margin[1])
  );

  x = clamp(x, 0, cols - w);
  y = clamp(y, 0, maxRows - h);

  return { x, y };
}

/**
 * Convert pixel width/height back to grid units (w, h).
 */
export function calcWH(
  params: PositionParams,
  width: number,
  height: number,
  x: number,
  y: number
): { w: number; h: number } {
  const { margin, rowHeight, cols, maxRows } = params;
  const colWidth = calcGridColWidth(params);

  let w = Math.round((width + margin[0]) / (colWidth + margin[0]));
  let h = Math.round((height + margin[1]) / (rowHeight + margin[1]));

  w = clamp(w, 1, cols - x);
  h = clamp(h, 1, maxRows - y);

  return { w, h };
}

