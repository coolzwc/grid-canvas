export interface DragHandlerOptions {
  threshold: number;
  onStart?: (e: PointerEvent, startX: number, startY: number) => void;
  onMove?: (e: PointerEvent, deltaX: number, deltaY: number) => void;
  onEnd?: (e: PointerEvent) => void;
  /** CSS selector for valid drag handles (if set, drag only starts on matching elements) */
  handle?: string;
  /** CSS selector for elements that prevent drag */
  cancel?: string;
}

/**
 * Pointer-event-based drag handler.
 * Attaches to a DOM element and reports drag deltas.
 */
export function createDragHandler(
  element: HTMLElement,
  options: DragHandlerOptions
): { destroy: () => void } {
  const { threshold, onStart, onMove, onEnd, handle, cancel } = options;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let hasExceededThreshold = false;
  let activePointerId: number | null = null;

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;

    const target = e.target as HTMLElement;
    if (cancel && target.closest(cancel)) return;
    if (handle && !target.closest(handle)) return;

    e.stopPropagation();
    e.preventDefault();

    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    hasExceededThreshold = false;
    activePointerId = e.pointerId;

    element.setPointerCapture(e.pointerId);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (!hasExceededThreshold) {
      if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
        return;
      }
      hasExceededThreshold = true;
      onStart?.(e, startX, startY);
    }

    onMove?.(e, deltaX, deltaY);
  }

  function onPointerUp(e: PointerEvent) {
    if (!isDragging) return;

    if (hasExceededThreshold) {
      onEnd?.(e);
    }

    isDragging = false;
    hasExceededThreshold = false;
    releaseCapture();
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  }

  function releaseCapture() {
    if (activePointerId !== null) {
      try {
        element.releasePointerCapture(activePointerId);
      } catch {
        // Element may already have lost capture
      }
      activePointerId = null;
    }
  }

  element.addEventListener('pointerdown', onPointerDown);

  return {
    destroy() {
      element.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      if (isDragging) {
        releaseCapture();
        isDragging = false;
      }
    },
  };
}
