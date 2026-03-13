import type { ResizeHandleAxis } from '../types';

export interface ResizeHandlerOptions {
  onStart?: (e: PointerEvent, handle: ResizeHandleAxis) => void;
  onMove?: (e: PointerEvent, deltaW: number, deltaH: number, handle: ResizeHandleAxis) => void;
  onEnd?: (e: PointerEvent, handle: ResizeHandleAxis) => void;
}

export function createResizeHandler(
  handleElement: HTMLElement,
  handle: ResizeHandleAxis,
  options: ResizeHandlerOptions
): { destroy: () => void } {
  const { onStart, onMove, onEnd } = options;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let activePointerId: number | null = null;

  function onPointerDown(e: PointerEvent) {
    if (e.button !== 0) return;
    e.stopPropagation();

    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    activePointerId = e.pointerId;

    handleElement.setPointerCapture(e.pointerId);
    onStart?.(e, handle);

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return;

    const rawDeltaX = e.clientX - startX;
    const rawDeltaY = e.clientY - startY;

    const { deltaW, deltaH } = computeResizeDeltas(handle, rawDeltaX, rawDeltaY);
    onMove?.(e, deltaW, deltaH, handle);
  }

  function onPointerUp(e: PointerEvent) {
    if (!isDragging) return;
    isDragging = false;
    releaseCapture();
    onEnd?.(e, handle);
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);
  }

  function releaseCapture() {
    if (activePointerId !== null) {
      try {
        handleElement.releasePointerCapture(activePointerId);
      } catch {
        // Element may already have lost capture
      }
      activePointerId = null;
    }
  }

  handleElement.addEventListener('pointerdown', onPointerDown);

  return {
    destroy() {
      handleElement.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      if (isDragging) {
        releaseCapture();
        isDragging = false;
      }
    },
  };
}

function computeResizeDeltas(
  handle: ResizeHandleAxis,
  rawDeltaX: number,
  rawDeltaY: number
): { deltaW: number; deltaH: number } {
  let deltaW = 0;
  let deltaH = 0;

  if (handle.includes('e')) deltaW = rawDeltaX;
  if (handle.includes('w')) deltaW = -rawDeltaX;
  if (handle.includes('s')) deltaH = rawDeltaY;
  if (handle.includes('n')) deltaH = -rawDeltaY;

  return { deltaW, deltaH };
}
