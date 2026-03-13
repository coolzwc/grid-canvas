import React from 'react';
import { useStore } from '../hooks/useStore';
import { transformCssSelector } from '../store/selectors';

export function CanvasViewport({ children }: { children: React.ReactNode }) {
  const transformCss = useStore(transformCssSelector);

  return (
    <div
      className="gc-viewport"
      style={{
        transform: transformCss,
        transformOrigin: '0 0',
        position: 'absolute',
        top: 0,
        left: 0,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
