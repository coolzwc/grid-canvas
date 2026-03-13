import type { Transform, Viewport, XYPosition, SnapGrid, Rect } from '../types';

export function viewportToTransform(viewport: Viewport): Transform {
  return [viewport.x, viewport.y, viewport.zoom];
}

export function transformToViewport(transform: Transform): Viewport {
  return { x: transform[0], y: transform[1], zoom: transform[2] };
}

/**
 * Convert screen (DOM) coordinates to canvas coordinates.
 * Screen → Canvas: subtract translate, divide by zoom.
 */
export function screenToCanvas(
  point: XYPosition,
  transform: Transform,
  snapToGrid = false,
  snapGrid: SnapGrid = [1, 1]
): XYPosition {
  const pos: XYPosition = {
    x: (point.x - transform[0]) / transform[2],
    y: (point.y - transform[1]) / transform[2],
  };
  return snapToGrid ? snapPosition(pos, snapGrid) : pos;
}

/**
 * Convert canvas coordinates to screen (DOM) coordinates.
 * Canvas → Screen: multiply by zoom, add translate.
 */
export function canvasToScreen(
  point: XYPosition,
  transform: Transform
): XYPosition {
  return {
    x: point.x * transform[2] + transform[0],
    y: point.y * transform[2] + transform[1],
  };
}

export function snapPosition(
  position: XYPosition,
  snapGrid: SnapGrid
): XYPosition {
  return {
    x: Math.round(position.x / snapGrid[0]) * snapGrid[0],
    y: Math.round(position.y / snapGrid[1]) * snapGrid[1],
  };
}

/**
 * Get the visible rect in canvas coordinates from the viewport transform.
 */
export function getVisibleRect(
  width: number,
  height: number,
  transform: Transform
): Rect {
  return {
    x: -transform[0] / transform[2],
    y: -transform[1] / transform[2],
    width: width / transform[2],
    height: height / transform[2],
  };
}
