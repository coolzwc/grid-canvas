import React, { useRef, useEffect } from 'react';
import { createPanZoom, type Viewport, type Transform } from '@grid-canvas/core';
import { useStoreApi } from '../contexts/GridCanvasContext';
import { useStore } from '../hooks/useStore';

export interface ZoomPaneProps {
  children: React.ReactNode;
  minZoom: number;
  maxZoom: number;
  defaultViewport: Viewport;
  panning: boolean;
  zooming: boolean;
  onViewportChange?: (viewport: Viewport) => void;
}

export function ZoomPane({
  children,
  minZoom,
  maxZoom,
  defaultViewport,
  panning,
  zooming,
  onViewportChange,
}: ZoomPaneProps) {
  const store = useStoreApi();
  const zoomPaneRef = useRef<HTMLDivElement>(null);
  const panZoomRef = useRef<ReturnType<typeof createPanZoom> | null>(null);
  const interactionMode = useStore((s) => s.interactionMode);

  const effectivePanning = interactionMode === 'hand' || panning;
  const effectiveZooming = interactionMode === 'hand' || zooming;

  useEffect(() => {
    const node = zoomPaneRef.current;
    if (!node) return;

    const panZoom = createPanZoom({
      domNode: node,
      minZoom,
      maxZoom,
      viewport: defaultViewport,
      panning: effectivePanning,
      zooming: effectiveZooming,
      isInteractionBlocked() {
        const s = store.getState();
        return s.activeDrag !== null || s.activeResize !== null;
      },
      onTransformChange(transform: Transform) {
        store.getState().setTransform(transform);
      },
      onPanZoom(_event, viewport) {
        onViewportChange?.(viewport);
      },
    });

    panZoomRef.current = panZoom;
    store.getState().setPanZoom(panZoom);
    store.getState().setTransform([defaultViewport.x, defaultViewport.y, defaultViewport.zoom]);

    return () => {
      panZoom.destroy();
      panZoomRef.current = null;
      store.setState({ panZoom: null });
    };
  }, []); // Only mount once

  useEffect(() => {
    panZoomRef.current?.update({
      minZoom,
      maxZoom,
      panning: effectivePanning,
      zooming: effectiveZooming,
    });
  }, [minZoom, maxZoom, effectivePanning, effectiveZooming]);

  return (
    <div
      ref={zoomPaneRef}
      className="gc-zoom-pane"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        touchAction: 'none',
        cursor: interactionMode === 'hand' ? 'grab' : undefined,
      }}
    >
      {children}
    </div>
  );
}
