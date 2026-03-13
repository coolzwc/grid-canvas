/**
 * Get the bounding client rect of an element relative to a container.
 */
export function getRelativePosition(
  element: HTMLElement,
  container: HTMLElement
): { top: number; left: number } {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    top: elementRect.top - containerRect.top,
    left: elementRect.left - containerRect.left,
  };
}

export interface ItemStyle {
  transform?: string;
  top?: string;
  left?: string;
  width: string;
  height: string;
  position: 'absolute';
}

/**
 * Set a CSS transform on an element for positioning.
 */
export function setTransformStyle(
  top: number,
  left: number,
  width: number,
  height: number
): ItemStyle {
  return {
    transform: `translate(${left}px, ${top}px)`,
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute',
  };
}

/**
 * Set top/left positioning instead of transform.
 */
export function setTopLeftStyle(
  top: number,
  left: number,
  width: number,
  height: number
): ItemStyle {
  return {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute',
  };
}
