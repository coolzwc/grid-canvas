import React, { memo, useCallback } from 'react';
import { useStoreApi } from '../contexts/GridCanvasContext';
import { useStore } from '../hooks/useStore';
import type { InteractionToolbarProps } from '../types';
import type { InteractionMode } from '@grid-canvas/core';

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  'top-left': { top: 10, left: 10 },
  'top-right': { top: 10, right: 10 },
  'bottom-left': { bottom: 10, left: 10 },
  'bottom-right': { bottom: 10, right: 10 },
};

function InteractionToolbarComponent({
  position = 'bottom-left',
  show = true,
  className = '',
}: InteractionToolbarProps) {
  const store = useStoreApi();
  const interactionMode = useStore((s) => s.interactionMode);

  const setMode = useCallback(
    (mode: InteractionMode) => {
      store.getState().setInteractionMode(mode);
    },
    [store]
  );

  if (!show) return null;

  return (
    <div
      className={`gc-interaction-toolbar ${className}`}
      style={{
        position: 'absolute',
        ...POSITION_STYLES[position],
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        zIndex: 10,
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        padding: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <button
        className={`gc-interaction-toolbar__btn ${interactionMode === 'select' ? 'gc-interaction-toolbar__btn--active' : ''}`}
        onClick={() => setMode('select')}
        title="Select mode (drag items)"
        style={interactionMode === 'select' ? activeBtnStyle : btnStyle}
      >
        {/* Cursor / arrow icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3.5 2L3.5 12.5L6.5 9.5L9.5 9.5L3.5 2Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 9.5L9 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        className={`gc-interaction-toolbar__btn ${interactionMode === 'hand' ? 'gc-interaction-toolbar__btn--active' : ''}`}
        onClick={() => setMode('hand')}
        title="Hand mode (pan canvas)"
        style={interactionMode === 'hand' ? activeBtnStyle : btnStyle}
      >
        {/* Hand / grab icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 2.5V9M8 2.5C8 1.95 8.45 1.5 9 1.5C9.55 1.5 10 1.95 10 2.5V8M8 2.5C8 1.95 7.55 1.5 7 1.5C6.45 1.5 6 1.95 6 2.5V8M10 2.5V8M10 3.5C10 2.95 10.45 2.5 11 2.5C11.55 2.5 12 2.95 12 3.5V9M6 3.5V8M6 3.5C6 2.95 5.55 2.5 5 2.5C4.45 2.5 4 2.95 4 3.5V9C4 12 6 14 8 14C10 14 12 12 12 9"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid transparent',
  borderRadius: 6,
  background: 'transparent',
  cursor: 'pointer',
  color: '#94a3b8',
  padding: 0,
  transition: 'background 150ms, color 150ms, border-color 150ms',
};

const activeBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: '#eff6ff',
  color: '#3b82f6',
  borderColor: '#bfdbfe',
};

InteractionToolbarComponent.displayName = 'InteractionToolbar';
export const InteractionToolbar = Object.assign(memo(InteractionToolbarComponent), {
  __isGridCanvasPlugin: true as const,
});
