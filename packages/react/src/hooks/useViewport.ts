import { useStore } from './useStore';
import { transformToViewport } from '@grid-canvas/core';

export function useViewport() {
  const transform = useStore((s) => s.transform);
  const panBy = useStore((s) => s.panBy);
  const zoomTo = useStore((s) => s.zoomTo);
  const fitView = useStore((s) => s.fitView);

  const viewport = transformToViewport(transform);

  return {
    viewport,
    transform,
    panBy,
    zoomTo,
    fitView,
  };
}
