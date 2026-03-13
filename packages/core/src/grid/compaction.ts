import type { Layout, LayoutItem, CompactType, Compactor, Mutable } from '../types';
import { getFirstCollision } from './collision';
import { sortLayoutItemsByRowCol, sortLayoutItemsByColRow } from './sort';

export function getCompactor(type: CompactType): Compactor {
  switch (type) {
    case 'vertical':
      return verticalCompactor;
    case 'horizontal':
      return horizontalCompactor;
    default:
      return noCompactor;
  }
}

export const verticalCompactor: Compactor = {
  type: 'vertical',
  compact(layout: Layout, cols: number): Layout {
    return compactLayout(layout, 'vertical', cols);
  },
};

export const horizontalCompactor: Compactor = {
  type: 'horizontal',
  compact(layout: Layout, cols: number): Layout {
    return compactLayout(layout, 'horizontal', cols);
  },
};

export const noCompactor: Compactor = {
  type: null,
  compact(layout: Layout): Layout {
    return layout;
  },
};

function compactLayout(
  layout: Layout,
  compactType: 'vertical' | 'horizontal',
  cols: number
): Layout {
  const sorted = [...layout].sort(
    compactType === 'vertical'
      ? sortLayoutItemsByRowCol
      : sortLayoutItemsByColRow
  );

  const compareWith: LayoutItem[] = [];
  const out = new Array<LayoutItem>(layout.length);

  for (let i = 0; i < sorted.length; i++) {
    let item = { ...sorted[i] };

    if (!item.isStatic) {
      item = compactItem(compareWith, item, compactType, cols, sorted);
    }

    compareWith.push(item);
    // Restore original layout order
    const idx = layout.findIndex((l) => l.i === item.i);
    out[idx] = item;
  }

  return out;
}

function compactItem(
  compareWith: LayoutItem[],
  item: LayoutItem,
  compactType: 'vertical' | 'horizontal',
  cols: number,
  fullLayout: Layout
): LayoutItem {
  const mutableItem = item as Mutable<LayoutItem>;

  // Clamp Infinity to a finite position to prevent infinite loops (DragFromOutside pattern)
  if (!Number.isFinite(mutableItem.y)) {
    let finiteBottom = 0;
    for (const l of fullLayout) {
      if (l.i !== mutableItem.i && Number.isFinite(l.y)) {
        finiteBottom = Math.max(finiteBottom, l.y + l.h);
      }
    }
    mutableItem.y = finiteBottom;
  }
  if (!Number.isFinite(mutableItem.x)) {
    mutableItem.x = cols;
  }

  if (compactType === 'vertical') {
    while (mutableItem.y > 0 && !getFirstCollision(compareWith, mutableItem)) {
      mutableItem.y--;
    }
  } else {
    while (mutableItem.x > 0 && !getFirstCollision(compareWith, mutableItem)) {
      mutableItem.x--;
    }
  }

  // Push down/right until no collisions
  let collision: LayoutItem | undefined;
  while (
    (collision = getFirstCollision(compareWith, mutableItem)) !== undefined
  ) {
    if (compactType === 'vertical') {
      resolveCompactionCollision(fullLayout, mutableItem, collision.y + collision.h, 'y');
    } else {
      resolveCompactionCollision(fullLayout, mutableItem, collision.x + collision.w, 'x');
    }
  }

  mutableItem.y = Math.max(mutableItem.y, 0);
  mutableItem.x = Math.max(mutableItem.x, 0);

  return mutableItem;
}

function resolveCompactionCollision(
  layout: Layout,
  item: Mutable<LayoutItem>,
  moveToCoord: number,
  axis: 'x' | 'y'
): void {
  const sizeProp = axis === 'x' ? 'w' : 'h';

  item[axis] = moveToCoord;

  const hasStatics = layout.some((l) => l.isStatic);

  for (let i = layout.length - 1; i >= 0; i--) {
    const other = layout[i];
    if (other.i === item.i) continue;
    if (!hasStatics) {
      if (axis === 'y' && other.y > item.y + item.h) break;
      if (axis === 'x' && other.x > item.x + item.w) break;
    }

    if (other.isStatic) {
      const crossAxis = axis === 'x' ? 'y' : 'x';
      const crossSize = axis === 'x' ? 'h' : 'w';
      const overlapsOnAxis =
        other[axis] + other[sizeProp] > item[axis] &&
        other[axis] < item[axis] + item[sizeProp];
      const overlapsOnCrossAxis =
        other[crossAxis] + other[crossSize] > item[crossAxis] &&
        other[crossAxis] < item[crossAxis] + item[crossSize];
      if (overlapsOnAxis && overlapsOnCrossAxis) {
        item[axis] = other[axis] + other[sizeProp];
      }
    }
  }
}
