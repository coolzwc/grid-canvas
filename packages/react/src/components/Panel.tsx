import React, { memo } from 'react';
import type { PanelProps } from '../types';

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  'top-left': { top: 10, left: 10 },
  'top-right': { top: 10, right: 10 },
  'bottom-left': { bottom: 10, left: 10 },
  'bottom-right': { bottom: 10, right: 10 },
};

function PanelComponent({ position, children, className = '' }: PanelProps) {
  return (
    <div
      className={`gc-panel ${className}`}
      style={{
        position: 'absolute',
        ...POSITION_STYLES[position],
        zIndex: 10,
      }}
    >
      {children}
    </div>
  );
}

PanelComponent.displayName = 'Panel';
export const Panel = Object.assign(memo(PanelComponent), {
  __isGridCanvasPlugin: true as const,
});
