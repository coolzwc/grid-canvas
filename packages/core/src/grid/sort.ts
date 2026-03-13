import type { LayoutItem } from '../types';

export function sortLayoutItemsByRowCol(a: LayoutItem, b: LayoutItem): number {
  if (a.y > b.y || (a.y === b.y && a.x > b.x)) return 1;
  if (a.y === b.y && a.x === b.x) return 0;
  return -1;
}

export function sortLayoutItemsByColRow(a: LayoutItem, b: LayoutItem): number {
  if (a.x > b.x || (a.x === b.x && a.y > b.y)) return 1;
  if (a.x === b.x && a.y === b.y) return 0;
  return -1;
}
