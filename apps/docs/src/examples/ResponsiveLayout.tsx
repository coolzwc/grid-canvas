import React, { useState } from 'react';
import { GridCanvas, Background, Controls, type Layout } from '@grid-canvas/react';

const initialItems: Layout = [
  { i: 'header', x: 0, y: 0, w: 12, h: 1, minH: 1 },
  { i: 'sidebar', x: 0, y: 1, w: 3, h: 4, minW: 2 },
  { i: 'main', x: 3, y: 1, w: 6, h: 4, minW: 3 },
  { i: 'aside', x: 9, y: 1, w: 3, h: 4, minW: 2 },
  { i: 'footer', x: 0, y: 5, w: 12, h: 1, minH: 1 },
];

export function ResponsiveLayout() {
  const [items, setItems] = useState(initialItems);

  return (
    <div style={{ width: '100%', height: 500, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <GridCanvas
        items={items}
        onItemsChange={setItems}
        cols={12}
        rowHeight={70}
        margin={[8, 8]}
        containerPadding={[8, 8]}
        compactType="vertical"
      >
        {items.map((item) => (
          <div
            key={item.i}
            style={{
              background: item.i === 'header' || item.i === 'footer' ? '#1e293b' : '#f1f5f9',
              borderRadius: 8,
              padding: 12,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: item.i === 'header' || item.i === 'footer' ? '#fff' : '#334155',
              fontWeight: 600,
              fontSize: 14,
              textTransform: 'capitalize',
              border: '1px solid #e2e8f0',
            }}
          >
            {item.i}
          </div>
        ))}
        <Background variant="dots" />
        <Controls position="bottom-left" />
      </GridCanvas>
    </div>
  );
}
