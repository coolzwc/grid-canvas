import type { Layout, LayoutItem, Mutable } from '../types';
import { collides, getAllCollisions, getFirstCollision } from './collision';
import { sortLayoutItemsByRowCol } from './sort';

export function cloneLayout(layout: Layout): Layout {
  return layout.map((item) => ({ ...item }));
}

export function cloneLayoutItem(item: LayoutItem): LayoutItem {
  return { ...item };
}

export function getLayoutItem(
  layout: Layout,
  id: string
): LayoutItem | undefined {
  return layout.find((l) => l.i === id);
}

/**
 * Return the bottom coordinate of the layout.
 */
export function bottom(layout: Layout): number {
  let max = 0;
  for (let i = 0; i < layout.length; i++) {
    const b = layout[i].y + layout[i].h;
    if (b > max) max = b;
  }
  return max;
}

/**
 * Move a layout item to a new grid position, resolving collisions.
 * Returns a new layout with the item moved.
 */
export function moveElement(
  layout: Layout,
  item: LayoutItem,
  x: number,
  y: number,
  isUserAction: boolean,
  preventCollision: boolean,
  cols: number
): Layout {
  if (item.isStatic) return layout;

  const newLayout = cloneLayout(layout);
  const movedItem = newLayout.find((l) => l.i === item.i);
  if (!movedItem) return newLayout;

  const mutable = movedItem as Mutable<LayoutItem>;

  if (preventCollision) {
    const testItem = { ...movedItem, x, y };
    const collisions = getAllCollisions(newLayout, testItem).filter(
      (c) => c.i !== item.i
    );
    if (collisions.length > 0) return newLayout;
  }

  mutable.x = x;
  mutable.y = y;

  // Resolve collisions by pushing other items
  const sorted = [...newLayout].sort(sortLayoutItemsByRowCol);
  const collisions = getAllCollisions(sorted, mutable);

  for (const collision of collisions) {
    if (collision.isStatic) continue;
    moveElementAwayFromCollision(newLayout, mutable, collision, isUserAction);
  }

  return newLayout;
}

function moveElementAwayFromCollision(
  layout: Layout,
  collider: LayoutItem,
  collidee: LayoutItem,
  isUserAction: boolean
): void {
  const collideeIdx = layout.findIndex((l) => l.i === collidee.i);
  if (collideeIdx === -1) return;

  const mutable = layout[collideeIdx] as Mutable<LayoutItem>;

  // Push the collidee below the collider
  mutable.y = collider.y + collider.h;

  // Recursively resolve any new collisions created
  const newCollisions = getAllCollisions(layout, mutable).filter(
    (c) => c.i !== mutable.i && c.i !== collider.i
  );

  for (const col of newCollisions) {
    if (col.isStatic) continue;
    moveElementAwayFromCollision(layout, mutable, col, false);
  }
}

/**
 * Validate layout: ensure all items are within bounds and have valid dimensions.
 */
export function validateLayout(layout: Layout, cols: number): Layout {
  return layout.map((item) => {
    const validated = { ...item };
    validated.w = Math.max(1, Math.min(validated.w, cols));
    validated.x = Math.max(0, Math.min(validated.x, cols - validated.w));
    validated.y = Math.max(0, validated.y);
    validated.h = Math.max(1, validated.h);
    if (validated.minW !== undefined)
      validated.w = Math.max(validated.w, validated.minW);
    if (validated.maxW !== undefined)
      validated.w = Math.min(validated.w, validated.maxW);
    if (validated.minH !== undefined)
      validated.h = Math.max(validated.h, validated.minH);
    if (validated.maxH !== undefined)
      validated.h = Math.min(validated.h, validated.maxH);
    return validated;
  });
}
