import type { Viewport, Rect } from '../types';
import { clamp } from '../utils/math';

/**
 * Calculate a viewport that fits the given bounds into a container,
 * respecting zoom limits and optional padding.
 */
export function getViewportForBounds(
  bounds: Rect,
  width: number,
  height: number,
  minZoom: number,
  maxZoom: number,
  padding = 0.1
): Viewport {
  const paddingX = width * padding;
  const paddingY = height * padding;

  const bw = bounds.width || 1;
  const bh = bounds.height || 1;
  const xZoom = (width - paddingX * 2) / bw;
  const yZoom = (height - paddingY * 2) / bh;
  const zoom = clamp(Math.min(xZoom, yZoom), minZoom, maxZoom);

  const centerX = bounds.x + bounds.width / 2;
  const centerY = bounds.y + bounds.height / 2;

  const x = width / 2 - centerX * zoom;
  const y = height / 2 - centerY * zoom;

  return { x, y, zoom };
}

/**
 * Check if two rects overlap (used for viewport culling).
 */
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Get the bounding rect of a list of rects.
 */
export function getBoundsOfRects(rects: Rect[]): Rect {
  if (rects.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const rect of rects) {
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

