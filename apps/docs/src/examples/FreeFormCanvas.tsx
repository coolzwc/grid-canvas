import React, { useState } from 'react';
import { GridCanvas, Background, Controls, MiniMap, type Layout } from '@grid-canvas/react';

const initialItems: Layout = [
  { i: 'note-1', x: 0, y: 0, w: 3, h: 2 },
  { i: 'note-2', x: 5, y: 3, w: 4, h: 3 },
  { i: 'note-3', x: 10, y: 1, w: 2, h: 2 },
  { i: 'note-4', x: 2, y: 6, w: 3, h: 2 },
  { i: 'note-5', x: 8, y: 5, w: 3, h: 3 },
];

const noteColors = ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5', '#ede9fe'];

export function FreeFormCanvas() {
  const [items, setItems] = useState(initialItems);

  return (
    <div style={{ width: '100%', height: 500, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
      <GridCanvas
        items={items}
        onItemsChange={setItems}
        cols={24}
        rowHeight={40}
        compactType={null}
        margin={[8, 8]}
        containerPadding={[20, 20]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.25}
        maxZoom={3}
      >
        {items.map((item, i) => (
          <div
            key={item.i}
            style={{
              background: noteColors[i % noteColors.length],
              borderRadius: 8,
              padding: 12,
              height: '100%',
              fontSize: 13,
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <strong>Note {i + 1}</strong>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 12 }}>
              Free-form sticky note. Pan and zoom the canvas!
            </p>
          </div>
        ))}
        <Background variant="grid" gap={40} color="rgba(0,0,0,0.04)" />
        <Controls position="bottom-left" />
        <MiniMap position="bottom-right" />
      </GridCanvas>
    </div>
  );
}
