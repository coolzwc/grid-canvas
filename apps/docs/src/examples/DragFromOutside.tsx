import React, { useState, useCallback } from 'react';
import { GridCanvas, Background, Controls, type Layout, type LayoutItem } from '@grid-canvas/react';

const AVAILABLE_WIDGETS = [
  { label: 'Chart', color: '#3b82f6', w: 4, h: 2 },
  { label: 'Table', color: '#10b981', w: 6, h: 3 },
  { label: 'Metric', color: '#f59e0b', w: 2, h: 1 },
  { label: 'Log', color: '#8b5cf6', w: 4, h: 3 },
];

export function DragFromOutside() {
  const [items, setItems] = useState<Layout>([
    { i: 'existing-1', x: 0, y: 0, w: 4, h: 2 },
  ]);

  const addWidget = useCallback(
    (widget: (typeof AVAILABLE_WIDGETS)[number]) => {
      const newId = `widget-${Date.now()}`;
      const newItem: LayoutItem = {
        i: newId,
        x: 0,
        y: Infinity,
        w: widget.w,
        h: widget.h,
      };
      setItems((prev) => [...prev, newItem]);
    },
    []
  );

  const getWidgetColor = (id: string) => {
    if (id === 'existing-1') return '#64748b';
    const widgetIdx = items.findIndex((i) => i.i === id);
    return AVAILABLE_WIDGETS[widgetIdx % AVAILABLE_WIDGETS.length]?.color ?? '#94a3b8';
  };

  return (
    <div style={{ display: 'flex', gap: 16, height: 500 }}>
      {/* Sidebar with draggable widgets */}
      <div
        style={{
          width: 160,
          padding: 12,
          background: '#f8fafc',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: 0 }}>
          Widgets
        </h4>
        {AVAILABLE_WIDGETS.map((widget) => (
          <button
            key={widget.label}
            onClick={() => addWidget(widget)}
            style={{
              padding: '8px 12px',
              background: widget.color,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              textAlign: 'left',
            }}
          >
            + {widget.label}
          </button>
        ))}
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <GridCanvas
          items={items}
          onItemsChange={setItems}
          cols={12}
          rowHeight={60}
          margin={[10, 10]}
          containerPadding={[10, 10]}
          compactType="vertical"
        >
          {items.map((item) => (
            <div
              key={item.i}
              style={{
                background: getWidgetColor(item.i),
                borderRadius: 8,
                padding: 12,
                color: '#fff',
                fontWeight: 500,
                fontSize: 13,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.i}
            </div>
          ))}
          <Background variant="dots" />
          <Controls position="bottom-left" />
        </GridCanvas>
      </div>
    </div>
  );
}
