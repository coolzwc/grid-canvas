import type { PositionParams } from '../types';
import { calcGridColWidth } from '../grid/calculate';

/**
 * Snap a pixel position to the nearest grid cell.
 */
export function snapToGridPosition(
  params: PositionParams,
  left: number,
  top: number
): { left: number; top: number } {
  const colWidth = calcGridColWidth(params);
  const { margin, containerPadding, rowHeight } = params;

  const cellW = colWidth + margin[0];
  const cellH = rowHeight + margin[1];

  const snappedLeft =
    Math.round((left - containerPadding[0]) / cellW) * cellW +
    containerPadding[0];
  const snappedTop =
    Math.round((top - containerPadding[1]) / cellH) * cellH +
    containerPadding[1];

  return { left: snappedLeft, top: snappedTop };
}
