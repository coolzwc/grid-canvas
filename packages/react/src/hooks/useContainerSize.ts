import { useEffect, useRef, useCallback } from 'react';

export function useContainerSize(
  onResize: (width: number, height: number) => void
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onResize);
  callbackRef.current = onResize;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        callbackRef.current(width, height);
      }
    });

    observer.observe(node);
    const rect = node.getBoundingClientRect();
    callbackRef.current(rect.width, rect.height);

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
