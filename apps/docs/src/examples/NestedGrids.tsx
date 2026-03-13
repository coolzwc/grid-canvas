import React, { useState } from 'react';
import { GridCanvas, Background, Controls, type Layout } from '@grid-canvas/react';

const outerItems: Layout = [
  { i: 'panel-1', x: 0, y: 0, w: 6, h: 4 },
  { i: 'panel-2', x: 6, y: 0, w: 6, h: 4 },
  { i: 'panel-3', x: 0, y: 4, w: 12, h: 3 },
];

const innerItems1: Layout = [
  { i: 'a1', x: 0, y: 0, w: 2, h: 1 },
  { i: 'a2', x: 2, y: 0, w: 2, h: 1 },
  { i: 'a3', x: 0, y: 1, w: 4, h: 1 },
];

const innerItems2: Layout = [
  { i: 'b1', x: 0, y: 0, w: 4, h: 1 },
  { i: 'b2', x: 0, y: 1, w: 2, h: 2 },
  { i: 'b3', x: 2, y: 1, w: 2, h: 2 },
];

const innerItems3: Layout = [
  { i: 'c1', x: 0, y: 0, w: 3, h: 1 },
  { i: 'c2', x: 3, y: 0, w: 3, h: 1 },
  { i: 'c3', x: 6, y: 0, w: 3, h: 1 },
  { i: 'c4', x: 9, y: 0, w: 3, h: 1 },
];

const innerColors = ['#e0f2fe', '#dbeafe', '#c7d2fe', '#e0e7ff'];

function InnerGrid({ items: initialInner, label }: { items: Layout; label: string }) {
  const [items, setItems] = useState(initialInner);

  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, color: '#475569' }}>
        {label}
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <GridCanvas
          items={items}
          onItemsChange={setItems}
          cols={4}
          rowHeight={40}
          margin={[6, 6]}
          containerPadding={[6, 6]}
          compactType="vertical"
          panning={false}
          zooming={false}
        >
          {items.map((item, i) => (
            <div
              key={item.i}
              style={{
                background: innerColors[i % innerColors.length],
                borderRadius: 6,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 500,
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              {item.i}
            </div>
          ))}
        </GridCanvas>
      </div>
    </div>
  );
}

export function NestedGrids() {
  const [items, setItems] = useState(outerItems);

  const INNER_MAP: Record<string, { items: Layout; label: string }> = {
    'panel-1': { items: innerItems1, label: 'Panel A' },
    'panel-2': { items: innerItems2, label: 'Panel B' },
    'panel-3': { items: innerItems3, label: 'Panel C' },
  };

  return (
    <div style={{ width: '100%', height: 550, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#f1f5f9' }}>
      <GridCanvas
        items={items}
        onItemsChange={setItems}
        cols={12}
        rowHeight={60}
        margin={[10, 10]}
        containerPadding={[10, 10]}
        compactType="vertical"
      >
        {items.map((item) => {
          const inner = INNER_MAP[item.i];
          return inner ? (
            <div key={item.i} style={{ height: '100%' }}>
              <InnerGrid items={inner.items} label={inner.label} />
            </div>
          ) : (
            <div key={item.i}>{item.i}</div>
          );
        })}
        <Background variant="grid" gap={60} color="rgba(0,0,0,0.04)" />
        <Controls position="bottom-left" />
      </GridCanvas>
    </div>
  );
}
