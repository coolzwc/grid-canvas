import type { LayoutItem, Layout } from '../types';

/**
 * AABB collision detection between two layout items.
 * Returns true if the bounding boxes overlap.
 */
export function collides(l1: LayoutItem, l2: LayoutItem): boolean {
  if (l1.i === l2.i) return false;
  if (l1.x + l1.w <= l2.x) return false;
  if (l1.x >= l2.x + l2.w) return false;
  if (l1.y + l1.h <= l2.y) return false;
  if (l1.y >= l2.y + l2.h) return false;
  return true;
}

export function getFirstCollision(
  layout: Layout,
  item: LayoutItem
): LayoutItem | undefined {
  for (let i = 0; i < layout.length; i++) {
    if (collides(item, layout[i])) return layout[i];
  }
  return undefined;
}

export function getAllCollisions(
  layout: Layout,
  item: LayoutItem
): LayoutItem[] {
  return layout.filter((l) => collides(item, l));
}
