import React from 'react';
import { useStore } from '../hooks/useStore';
import { calcGridItemPosition } from '@grid-canvas/core';

export function Placeholder() {
  const activeDrag = useStore((s) => s.activeDrag);
  const getPositionParams = useStore((s) => s.getPositionParams);
  const item = useStore((s) =>
    s.activeDrag ? s.items.find((i) => i.i === s.activeDrag.itemId) : null
  );

  if (!activeDrag || !item) return null;

  const params = getPositionParams();
  const pos = calcGridItemPosition(params, activeDrag.x, activeDrag.y, item.w, item.h);

  return (
    <div
      className="gc-placeholder"
      style={{
        position: 'absolute',
        transform: `translate(${pos.left}px, ${pos.top}px)`,
        width: pos.width,
        height: pos.height,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        border: '2px dashed rgba(59, 130, 246, 0.5)',
        borderRadius: 6,
        transition: 'transform 150ms ease, width 150ms ease, height 150ms ease',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
