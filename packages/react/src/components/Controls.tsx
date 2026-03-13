import React, { memo, useCallback } from 'react';
import { useStoreApi } from '../contexts/GridCanvasContext';
import type { ControlsProps } from '../types';

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  'top-left': { top: 10, left: 10 },
  'top-right': { top: 10, right: 10 },
  'bottom-left': { bottom: 10, left: 10 },
  'bottom-right': { bottom: 10, right: 10 },
};

function ControlsComponent({
  position = 'bottom-left',
  showZoom = true,
  showFitView = true,
  className = '',
}: ControlsProps) {
  const store = useStoreApi();

  const handleZoomIn = useCallback(() => {
    const [, , zoom] = store.getState().transform;
    store.getState().zoomTo(Math.min(4, zoom + 0.2));
  }, [store]);

  const handleZoomOut = useCallback(() => {
    const [, , zoom] = store.getState().transform;
    store.getState().zoomTo(Math.max(0.1, zoom - 0.2));
  }, [store]);

  const handleFitView = useCallback(() => {
    store.getState().fitView();
  }, [store]);

  return (
    <div
      className={`gc-controls ${className}`}
      style={{
        position: 'absolute',
        ...POSITION_STYLES[position],
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        zIndex: 10,
      }}
    >
      {showZoom && (
        <>
          <button
            className="gc-controls__btn gc-controls__zoom-in"
            onClick={handleZoomIn}
            title="Zoom In"
            style={btnStyle}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button
            className="gc-controls__btn gc-controls__zoom-out"
            onClick={handleZoomOut}
            title="Zoom Out"
            style={btnStyle}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </>
      )}
      {showFitView && (
        <button
          className="gc-controls__btn gc-controls__fit-view"
          onClick={handleFitView}
          title="Fit View"
          style={btnStyle}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 5.5V3a1 1 0 011-1h2.5M10.5 2H13a1 1 0 011 1v2.5M14 10.5V13a1 1 0 01-1 1h-2.5M5.5 14H3a1 1 0 01-1-1v-2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#fff',
  cursor: 'pointer',
  color: '#475569',
  padding: 0,
  transition: 'background 150ms, border-color 150ms',
};

ControlsComponent.displayName = 'Controls';
export const Controls = Object.assign(memo(ControlsComponent), {
  __isGridCanvasPlugin: true as const,
});
