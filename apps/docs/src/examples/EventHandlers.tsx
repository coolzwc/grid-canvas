import React, { useState, useCallback } from 'react';
import { GridCanvas, Background, Controls, type Layout, type LayoutItem } from '@grid-canvas/react';

const initialItems: Layout = [
  { i: 'widget-1', x: 0, y: 0, w: 4, h: 2 },
  { i: 'widget-2', x: 4, y: 0, w: 4, h: 2 },
  { i: 'widget-3', x: 8, y: 0, w: 4, h: 3 },
  { i: 'widget-4', x: 0, y: 2, w: 6, h: 2 },
  { i: 'widget-5', x: 6, y: 3, w: 6, h: 2 },
];

const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

interface LogEntry {
  id: number;
  time: string;
  type: 'drag' | 'resize' | 'change' | 'click';
  message: string;
}

export function EventHandlers() {
  const [items, setItems] = useState(initialItems);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nextId, setNextId] = useState(0);

  const addLog = useCallback(
    (type: LogEntry['type'], message: string) => {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setLogs((prev) => [{ id: nextId, time, type, message }, ...prev].slice(0, 30));
      setNextId((n) => n + 1);
    },
    [nextId]
  );

  const handleItemsChange = useCallback(
    (newItems: Layout) => {
      setItems(newItems);
      addLog('change', `Layout updated — ${newItems.length} items`);
    },
    [addLog]
  );

  const handleDragStart = useCallback(
    (item: LayoutItem, _event: PointerEvent) => {
      addLog('drag', `Drag started: ${item.i} at (${item.x}, ${item.y})`);
    },
    [addLog]
  );

  const handleDragStop = useCallback(
    (item: LayoutItem, _event: PointerEvent) => {
      addLog('drag', `Drag ended: ${item.i} → (${item.x}, ${item.y})`);
    },
    [addLog]
  );

  const handleResizeStart = useCallback(
    (item: LayoutItem, _event: PointerEvent) => {
      addLog('resize', `Resize started: ${item.i} — ${item.w}×${item.h}`);
    },
    [addLog]
  );

  const handleResizeStop = useCallback(
    (item: LayoutItem, _event: PointerEvent) => {
      addLog('resize', `Resize ended: ${item.i} → ${item.w}×${item.h}`);
    },
    [addLog]
  );

  const typeColor: Record<LogEntry['type'], string> = {
    drag: '#60a5fa',
    resize: '#a78bfa',
    change: '#34d399',
    click: '#fbbf24',
  };

  return (
    <div style={{ display: 'flex', gap: 16, height: 520 }}>
      <div style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <GridCanvas
          items={items}
          onItemsChange={handleItemsChange}
          onDragStart={handleDragStart}
          onDragStop={handleDragStop}
          onResizeStart={handleResizeStart}
          onResizeStop={handleResizeStop}
          cols={12}
          rowHeight={55}
          margin={[10, 10]}
          containerPadding={[10, 10]}
          compactType="vertical"
        >
          {items.map((item, i) => (
            <div
              key={item.i}
              onClick={() => addLog('click', `Clicked: ${item.i}`)}
              style={{
                background: colors[i % colors.length],
                borderRadius: 8,
                padding: 16,
                color: '#fff',
                fontWeight: 600,
                fontSize: 13,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <div>{item.i}</div>
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
                ({item.x}, {item.y}) {item.w}×{item.h}
              </div>
            </div>
          ))}
          <Background variant="dots" />
          <Controls position="bottom-left" />
        </GridCanvas>
      </div>

      {/* Event log panel */}
      <div
        style={{
          width: 300,
          background: '#1e293b',
          borderRadius: 12,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>Event Log</span>
          <button
            onClick={() => setLogs([])}
            style={{
              fontSize: 11,
              color: '#64748b',
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: 4,
              padding: '3px 8px',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '6px 0',
            fontFamily: "'SF Mono', Menlo, Consolas, monospace",
            fontSize: 11,
          }}
        >
          {logs.length === 0 ? (
            <div style={{ padding: 16, color: '#475569', textAlign: 'center', fontSize: 12 }}>
              Drag, resize, or click items to see events
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '4px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ color: '#475569', flexShrink: 0 }}>{log.time}</span>
                <span
                  style={{
                    color: typeColor[log.type],
                    fontWeight: 600,
                    width: 44,
                    flexShrink: 0,
                    textTransform: 'uppercase',
                    fontSize: 10,
                  }}
                >
                  {log.type}
                </span>
                <span style={{ color: '#94a3b8' }}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
