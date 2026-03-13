import React, { useState } from 'react';
import { GridCanvas, Background, Controls, type Layout } from '@grid-canvas/react';

const initialItems: Layout = [
  { i: 'a', x: 0, y: 0, w: 4, h: 2 },
  { i: 'b', x: 4, y: 0, w: 4, h: 3 },
  { i: 'c', x: 8, y: 0, w: 4, h: 2 },
  { i: 'd', x: 0, y: 2, w: 6, h: 2 },
  { i: 'e', x: 6, y: 3, w: 6, h: 2 },
  { i: 'f', x: 0, y: 4, w: 3, h: 2 },
];

const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function BasicGrid() {
  const [items, setItems] = useState(initialItems);

  return (
    <div style={{ width: '100%', height: 500, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <GridCanvas
        items={items}
        onItemsChange={setItems}
        cols={12}
        rowHeight={60}
        margin={[12, 12]}
        containerPadding={[12, 12]}
        compactType="vertical"
      >
        {items.map((item, i) => (
          <div
            key={item.i}
            style={{
              background: colors[i % colors.length],
              borderRadius: 8,
              padding: 16,
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Item {item.i.toUpperCase()}
          </div>
        ))}
        <Background variant="dots" />
        <Controls position="bottom-left" />
      </GridCanvas>
    </div>
  );
}
