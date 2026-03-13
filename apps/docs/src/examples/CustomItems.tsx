import React, { useState } from 'react';
import { GridCanvas, Background, Controls, type Layout } from '@grid-canvas/react';

const initialItems: Layout = [
  { i: 'chart', x: 0, y: 0, w: 6, h: 3 },
  { i: 'metrics', x: 6, y: 0, w: 3, h: 2 },
  { i: 'status', x: 9, y: 0, w: 3, h: 2 },
  { i: 'log', x: 0, y: 3, w: 4, h: 2 },
  { i: 'alerts', x: 4, y: 3, w: 4, h: 2 },
  { i: 'info', x: 8, y: 2, w: 4, h: 3 },
];

function ChartWidget() {
  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16, display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Revenue Chart</h3>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 4, paddingTop: 12 }}>
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
          <div key={i} style={{ flex: 1, background: `hsl(221, 83%, ${60 + (i % 3) * 10}%)`, height: `${h}%`, borderRadius: 3, minWidth: 0, transition: 'height 300ms' }} />
        ))}
      </div>
    </div>
  );
}

function MetricsWidget() {
  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Metrics</h3>
      <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
        {[{ label: 'Users', value: '12.4K', color: '#3b82f6' }, { label: 'Revenue', value: '$84K', color: '#10b981' }].map((m) => (
          <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748b' }}>{m.label}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusWidget() {
  return (
    <div style={{ height: '100%', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 8, padding: 16, color: '#fff' }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>System Status</h3>
      <p style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 800 }}>99.9%</p>
      <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.8 }}>Uptime last 30 days</p>
    </div>
  );
}

function LogWidget() {
  const logs = [
    { time: '12:04', msg: 'Deployment completed', type: 'success' },
    { time: '12:02', msg: 'Build started', type: 'info' },
    { time: '11:58', msg: 'Tests passed', type: 'success' },
    { time: '11:55', msg: 'PR merged', type: 'info' },
  ];
  return (
    <div style={{ height: '100%', background: '#1e293b', borderRadius: 8, padding: 12, color: '#94a3b8', fontSize: 11, fontFamily: 'monospace', overflow: 'auto' }}>
      {logs.map((log, i) => (
        <div key={i} style={{ padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: '#64748b' }}>{log.time}</span>{' '}
          <span style={{ color: log.type === 'success' ? '#4ade80' : '#60a5fa' }}>{log.msg}</span>
        </div>
      ))}
    </div>
  );
}

function AlertsWidget() {
  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Alerts</h3>
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {['CPU usage high', 'Memory warning'].map((alert, i) => (
          <div key={i} style={{ padding: '6px 10px', background: i === 0 ? '#fef2f2' : '#fffbeb', borderRadius: 6, fontSize: 12, color: i === 0 ? '#ef4444' : '#f59e0b' }}>
            {alert}
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoWidget() {
  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16 }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>Server Info</h3>
      <div style={{ marginTop: 8, fontSize: 12, color: '#64748b', display: 'grid', gap: 6 }}>
        <div>Region: <strong style={{ color: '#1e293b' }}>us-east-1</strong></div>
        <div>Instances: <strong style={{ color: '#1e293b' }}>8</strong></div>
        <div>Load: <strong style={{ color: '#10b981' }}>42%</strong></div>
        <div>Memory: <strong style={{ color: '#f59e0b' }}>73%</strong></div>
      </div>
    </div>
  );
}

const WIDGET_MAP: Record<string, React.FC> = {
  chart: ChartWidget,
  metrics: MetricsWidget,
  status: StatusWidget,
  log: LogWidget,
  alerts: AlertsWidget,
  info: InfoWidget,
};

export function CustomItems() {
  const [items, setItems] = useState(initialItems);

  return (
    <div style={{ width: '100%', height: 500, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#f8fafc' }}>
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
          const Widget = WIDGET_MAP[item.i];
          return Widget ? (
            <div key={item.i} style={{ height: '100%' }}>
              <Widget />
            </div>
          ) : (
            <div key={item.i}>{item.i}</div>
          );
        })}
        <Background variant="dots" color="rgba(0,0,0,0.04)" />
        <Controls position="bottom-left" />
      </GridCanvas>
    </div>
  );
}
