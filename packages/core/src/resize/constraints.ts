import type { LayoutItem } from '../types';

export interface SizeConstraints {
  minW: number;
  maxW: number;
  minH: number;
  maxH: number;
}

export function getSizeConstraints(
  item: LayoutItem,
  cols: number
): SizeConstraints {
  return {
    minW: item.minW ?? 1,
    maxW: item.maxW ?? cols,
    minH: item.minH ?? 1,
    maxH: item.maxH ?? Infinity,
  };
}

export function constrainSize(
  w: number,
  h: number,
  constraints: SizeConstraints
): { w: number; h: number } {
  return {
    w: Math.max(constraints.minW, Math.min(constraints.maxW, w)),
    h: Math.max(constraints.minH, Math.min(constraints.maxH, h)),
  };
}
