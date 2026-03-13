import React, { useState, useMemo } from 'react';
import { GridCanvas, Background, Controls, MiniMap, type Layout } from '@grid-canvas/react';

function generateItems(count: number): Layout {
  const items: Layout = [];
  const cols = 12;
  let currentY = 0;
  let currentX = 0;

  for (let i = 0; i < count; i++) {
    const w = 2 + Math.floor(Math.random() * 3);
    const h = 1 + Math.floor(Math.random() * 2);

    if (currentX + w > cols) {
      currentX = 0;
      currentY += 2;
    }

    items.push({
      i: `item-${i}`,
      x: currentX,
      y: currentY,
      w,
      h,
    });

    currentX += w;
  }

  return items;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

export function LargeDataset() {
  const [count, setCount] = useState(200);
  const initialItems = useMemo(() => generateItems(count), [count]);
  const [items, setItems] = useState(initialItems);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#64748b' }}>Items:</span>
        {[100, 200, 500, 1000].map((n) => (
          <button
            key={n}
            onClick={() => {
              setCount(n);
              setItems(generateItems(n));
            }}
            style={{
              padding: '4px 12px',
              fontSize: 12,
              border: count === n ? '2px solid #3b82f6' : '1px solid #e2e8f0',
              borderRadius: 6,
              background: count === n ? '#eff6ff' : '#fff',
              color: count === n ? '#3b82f6' : '#64748b',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {n}
          </button>
        ))}
        <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>
          ({items.length} items rendered)
        </span>
      </div>

      <div style={{ width: '100%', height: 500, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <GridCanvas
          items={items}
          onItemsChange={setItems}
          cols={12}
          rowHeight={50}
          margin={[6, 6]}
          containerPadding={[6, 6]}
          compactType="vertical"
          onlyRenderVisibleItems
          minZoom={0.1}
          maxZoom={3}
        >
          {items.map((item, i) => (
            <div
              key={item.i}
              style={{
                background: COLORS[i % COLORS.length],
                borderRadius: 6,
                padding: 8,
                color: '#fff',
                fontSize: 11,
                fontWeight: 500,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.85,
              }}
            >
              {item.i}
            </div>
          ))}
          <Background variant="dots" />
          <Controls position="bottom-left" />
          <MiniMap position="bottom-right" width={160} height={100} />
        </GridCanvas>
      </div>
    </div>
  );
}
