import React, { memo, useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import {
  calcGridItemPosition,
  getVisibleRect,
} from '@grid-canvas/core';
import type { MiniMapProps } from '../types';

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  'top-left': { top: 10, left: 10 },
  'top-right': { top: 10, right: 10 },
  'bottom-left': { bottom: 10, left: 10 },
  'bottom-right': { bottom: 10, right: 10 },
};

function MiniMapComponent({
  position = 'bottom-right',
  width: mapWidth = 180,
  height: mapHeight = 120,
  className = '',
}: MiniMapProps) {
  const items = useStore((s) => s.items);
  const transform = useStore((s) => s.transform);
  const canvasWidth = useStore((s) => s.width);
  const canvasHeight = useStore((s) => s.height);
  const cols = useStore((s) => s.cols);
  const rowHeight = useStore((s) => s.rowHeight);
  const margin = useStore((s) => s.margin);
  const containerPadding = useStore((s) => s.containerPadding);
  const getPositionParams = useStore((s) => s.getPositionParams);

  const params = useMemo(() => getPositionParams(), [cols, rowHeight, margin, containerPadding, canvasWidth]);

  // Compute bounding box of all items
  const { rects, bounds } = useMemo(() => {
    if (items.length === 0) {
      return { rects: [], bounds: { minX: 0, minY: 0, maxX: 100, maxY: 100 } };
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const rs = items.map((item) => {
      const pos = calcGridItemPosition(params, item.x, item.y, item.w, item.h);
      const r = { id: item.i, x: pos.left, y: pos.top, w: pos.width, h: pos.height };
      minX = Math.min(minX, r.x);
      minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.w);
      maxY = Math.max(maxY, r.y + r.h);
      return r;
    });

    const padding = 20;
    return {
      rects: rs,
      bounds: { minX: minX - padding, minY: minY - padding, maxX: maxX + padding, maxY: maxY + padding },
    };
  }, [items, params]);

  const boundsWidth = bounds.maxX - bounds.minX;
  const boundsHeight = bounds.maxY - bounds.minY;
  const scale = Math.min(mapWidth / boundsWidth, mapHeight / boundsHeight);

  // Visible viewport in canvas coords
  const visibleRect = getVisibleRect(canvasWidth, canvasHeight, transform);

  return (
    <div
      className={`gc-minimap ${className}`}
      style={{
        position: 'absolute',
        ...POSITION_STYLES[position],
        width: mapWidth,
        height: mapHeight,
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        overflow: 'hidden',
        zIndex: 10,
        backdropFilter: 'blur(8px)',
      }}
    >
      <svg width={mapWidth} height={mapHeight}>
        {rects.map((rect) => (
          <rect
            key={rect.id}
            x={(rect.x - bounds.minX) * scale}
            y={(rect.y - bounds.minY) * scale}
            width={rect.w * scale}
            height={rect.h * scale}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="rgba(59, 130, 246, 0.6)"
            strokeWidth={1}
            rx={2}
          />
        ))}
        {/* Viewport indicator */}
        <rect
          x={(visibleRect.x - bounds.minX) * scale}
          y={(visibleRect.y - bounds.minY) * scale}
          width={visibleRect.width * scale}
          height={visibleRect.height * scale}
          fill="none"
          stroke="rgba(239, 68, 68, 0.6)"
          strokeWidth={1.5}
          rx={2}
        />
      </svg>
    </div>
  );
}

MiniMapComponent.displayName = 'MiniMap';
export const MiniMap = Object.assign(memo(MiniMapComponent), {
  __isGridCanvasPlugin: true as const,
});
