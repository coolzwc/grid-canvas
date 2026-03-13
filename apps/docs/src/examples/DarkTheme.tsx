import React, { useState } from 'react';
import { GridCanvas, Background, Controls, MiniMap, type Layout } from '@grid-canvas/react';

const initialItems: Layout = [
  { i: 'cpu', x: 0, y: 0, w: 4, h: 2 },
  { i: 'memory', x: 4, y: 0, w: 4, h: 2 },
  { i: 'network', x: 8, y: 0, w: 4, h: 2 },
  { i: 'requests', x: 0, y: 2, w: 8, h: 3 },
  { i: 'errors', x: 8, y: 2, w: 4, h: 3 },
  { i: 'logs', x: 0, y: 5, w: 12, h: 2 },
];

function GaugeCard({ label, value, unit, color, trend }: { label: string; value: number; unit: string; color: string; trend: string }) {
  return (
    <div style={{ height: '100%', background: '#1a1a2e', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', padding: 16, display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 11, color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color }}>{value}</span>
        <span style={{ fontSize: 14, color: '#64748b' }}>{unit}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
        <span style={{ color: trend.startsWith('+') ? '#4ade80' : '#f87171' }}>{trend}</span>
        <span style={{ color: '#475569' }}>vs last hour</span>
      </div>
    </div>
  );
}

function RequestChart() {
  const data = [12, 18, 32, 28, 42, 38, 55, 48, 62, 58, 45, 52, 38, 65, 72, 68, 55, 48, 42, 58];
  const max = Math.max(...data);
  return (
    <div style={{ height: '100%', background: '#1a1a2e', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', padding: 16, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Requests / min</span>
        <span style={{ fontSize: 11, color: '#64748b', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>Last 20 min</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        {data.map((v, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${(v / max) * 100}%`,
              background: `linear-gradient(to top, hsl(${220 + i * 2}, 80%, 55%), hsl(${220 + i * 2}, 80%, 65%))`,
              borderRadius: 2,
              minWidth: 0,
              opacity: 0.9,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ErrorPanel() {
  const errors = [
    { code: '500', msg: 'Internal Server Error', count: 12, severity: 'critical' },
    { code: '429', msg: 'Rate Limited', count: 34, severity: 'warning' },
    { code: '404', msg: 'Not Found', count: 89, severity: 'info' },
    { code: '403', msg: 'Forbidden', count: 5, severity: 'warning' },
  ];
  const severityColor = { critical: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
  return (
    <div style={{ height: '100%', background: '#1a1a2e', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', padding: 16, display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 10 }}>Error Breakdown</span>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, overflow: 'auto' }}>
        {errors.map((e) => (
          <div key={e.code} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(255,255,255,0.03)', borderRadius: 6, borderLeft: `3px solid ${severityColor[e.severity as keyof typeof severityColor]}` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', fontFamily: 'monospace', width: 32 }}>{e.code}</span>
            <span style={{ fontSize: 12, color: '#94a3b8', flex: 1 }}>{e.msg}</span>
            <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{e.count}x</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogStream() {
  const logs = [
    { ts: '14:23:01', level: 'INFO', msg: 'Request processed in 42ms — GET /api/v1/users' },
    { ts: '14:23:00', level: 'WARN', msg: 'Rate limit approaching threshold — IP 192.168.1.42' },
    { ts: '14:22:58', level: 'INFO', msg: 'Cache hit ratio: 94.2% — Redis cluster healthy' },
    { ts: '14:22:55', level: 'ERR', msg: 'Connection timeout — upstream service api-gateway' },
    { ts: '14:22:52', level: 'INFO', msg: 'Deployment v2.4.1 rolled out to 8/8 pods' },
    { ts: '14:22:50', level: 'INFO', msg: 'Health check passed — all services operational' },
  ];
  const levelColor = { INFO: '#4ade80', WARN: '#fbbf24', ERR: '#f87171' };
  return (
    <div style={{ height: '100%', background: '#0f0f1a', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', fontFamily: "'SF Mono', Menlo, Consolas, monospace", fontSize: 11, overflow: 'auto' }}>
      {logs.map((log, i) => (
        <div key={i} style={{ padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', gap: 8 }}>
          <span style={{ color: '#475569', flexShrink: 0 }}>{log.ts}</span>
          <span style={{ color: levelColor[log.level as keyof typeof levelColor], fontWeight: 600, width: 34, flexShrink: 0 }}>{log.level}</span>
          <span style={{ color: '#94a3b8' }}>{log.msg}</span>
        </div>
      ))}
    </div>
  );
}

const WIDGET_MAP: Record<string, React.FC> = {
  cpu: () => <GaugeCard label="CPU Usage" value={67} unit="%" color="#60a5fa" trend="+3.2%" />,
  memory: () => <GaugeCard label="Memory" value={4.2} unit="GB" color="#a78bfa" trend="-0.5%" />,
  network: () => <GaugeCard label="Network I/O" value={842} unit="MB/s" color="#34d399" trend="+12%" />,
  requests: RequestChart,
  errors: ErrorPanel,
  logs: LogStream,
};

export function DarkTheme() {
  const [items, setItems] = useState(initialItems);

  return (
    <div style={{ width: '100%', height: 550, borderRadius: 12, overflow: 'hidden', background: '#12121f', border: '1px solid rgba(255,255,255,0.08)' }}>
      <GridCanvas
        items={items}
        onItemsChange={setItems}
        cols={12}
        rowHeight={55}
        margin={[10, 10]}
        containerPadding={[12, 12]}
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
        <Background variant="dots" color="rgba(255,255,255,0.03)" />
        <Controls position="bottom-left" />
        <MiniMap position="bottom-right" />
      </GridCanvas>
    </div>
  );
}
