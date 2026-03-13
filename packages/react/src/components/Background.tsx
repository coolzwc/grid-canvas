import React, { memo, useId, useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import type { BackgroundProps } from '../types';

function BackgroundComponent({
  variant = 'dots',
  gap = 20,
  size,
  color,
  className = '',
}: BackgroundProps) {
  const transform = useStore((s) => s.transform);

  const patternSize = size ?? (variant === 'dots' ? 1.5 : 1);
  const patternColor = color ?? 'rgba(0, 0, 0, 0.08)';

  const scaledGap = gap * transform[2];
  const offsetX = transform[0] % scaledGap;
  const offsetY = transform[1] % scaledGap;

  const reactId = useId();
  const patternId = `gc-bg-pattern-${variant}-${reactId}`;

  const patternContent = useMemo(() => {
    switch (variant) {
      case 'dots':
        return (
          <circle
            cx={patternSize}
            cy={patternSize}
            r={patternSize}
            fill={patternColor}
          />
        );
      case 'grid':
        return (
          <path
            d={`M ${scaledGap} 0 L 0 0 0 ${scaledGap}`}
            fill="none"
            stroke={patternColor}
            strokeWidth={patternSize}
          />
        );
      case 'lines':
        return (
          <path
            d={`M 0 0 L ${scaledGap} 0`}
            fill="none"
            stroke={patternColor}
            strokeWidth={patternSize}
          />
        );
      default:
        return null;
    }
  }, [variant, scaledGap, patternSize, patternColor]);

  return (
    <svg
      className={`gc-background ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <pattern
        id={patternId}
        x={offsetX}
        y={offsetY}
        width={scaledGap}
        height={scaledGap}
        patternUnits="userSpaceOnUse"
      >
        {patternContent}
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

BackgroundComponent.displayName = 'Background';
export const Background = Object.assign(memo(BackgroundComponent), {
  __isGridCanvasPlugin: true as const,
});
