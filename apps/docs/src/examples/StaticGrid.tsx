import React, { useState } from 'react';
import { GridCanvas, Background, Controls, type Layout } from '@grid-canvas/react';

const initialItems: Layout = [
  { i: 'profile', x: 0, y: 0, w: 4, h: 3, isStatic: true },
  { i: 'stats', x: 4, y: 0, w: 8, h: 1, isStatic: true },
  { i: 'chart', x: 4, y: 1, w: 5, h: 2 },
  { i: 'activity', x: 9, y: 1, w: 3, h: 2 },
  { i: 'tasks', x: 0, y: 3, w: 6, h: 2 },
  { i: 'calendar', x: 6, y: 3, w: 6, h: 2 },
];

function ProfileCard() {
  return (
    <div style={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 8, padding: 20, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
        A
      </div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>Alice Chen</div>
      <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Product Designer</div>
      <div style={{ fontSize: 10, marginTop: 8, padding: '3px 10px', background: 'rgba(255,255,255,0.2)', borderRadius: 20 }}>
        Locked
      </div>
    </div>
  );
}

function StatsBar() {
  const stats = [
    { label: 'Projects', value: '24', color: '#3b82f6' },
    { label: 'Completed', value: '18', color: '#10b981' },
    { label: 'In Progress', value: '4', color: '#f59e0b' },
    { label: 'Overdue', value: '2', color: '#ef4444' },
  ];
  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 24 }}>
      {stats.map((s) => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</span>
          <span style={{ fontSize: 11, color: '#94a3b8' }}>{s.label}</span>
        </div>
      ))}
      <div style={{ marginLeft: 'auto', fontSize: 10, padding: '3px 10px', background: '#f1f5f9', borderRadius: 20, color: '#94a3b8' }}>
        Locked
      </div>
    </div>
  );
}

function SimpleCard({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', padding: 16, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{title}</h3>
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

const WIDGET_MAP: Record<string, React.FC> = {
  profile: ProfileCard,
  stats: StatsBar,
  chart: () => (
    <SimpleCard title="Revenue" color="#3b82f6">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: '100%', paddingTop: 8 }}>
        {[30, 50, 45, 70, 60, 80, 55, 75, 90, 65, 85, 70].map((h, i) => (
          <div key={i} style={{ flex: 1, background: `hsl(221, 83%, ${55 + (i % 3) * 8}%)`, height: `${h}%`, borderRadius: 3, minWidth: 0 }} />
        ))}
      </div>
    </SimpleCard>
  ),
  activity: () => (
    <SimpleCard title="Activity" color="#8b5cf6">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {['Design review', 'Sprint planning', 'Code merged'].map((item, i) => (
          <div key={i} style={{ fontSize: 12, color: '#64748b', padding: '4px 8px', background: '#f8fafc', borderRadius: 4 }}>
            {item}
          </div>
        ))}
      </div>
    </SimpleCard>
  ),
  tasks: () => (
    <SimpleCard title="Tasks" color="#f59e0b">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { text: 'Update design system', done: true },
          { text: 'Review pull requests', done: true },
          { text: 'Prepare presentation', done: false },
          { text: 'Team sync meeting', done: false },
        ].map((task, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: task.done ? '#94a3b8' : '#334155', textDecoration: task.done ? 'line-through' : 'none' }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${task.done ? '#10b981' : '#cbd5e1'}`, background: task.done ? '#10b981' : 'transparent', flexShrink: 0 }} />
            {task.text}
          </div>
        ))}
      </div>
    </SimpleCard>
  ),
  calendar: () => (
    <SimpleCard title="Calendar" color="#06b6d4">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 10, textAlign: 'center' }}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} style={{ color: '#94a3b8', fontWeight: 600, padding: 2 }}>{d}</div>
        ))}
        {Array.from({ length: 28 }, (_, i) => {
          const day = i + 1;
          const hasEvent = [3, 7, 12, 15, 18, 22].includes(day);
          const isToday = day === 13;
          return (
            <div
              key={i}
              style={{
                padding: 3,
                borderRadius: 4,
                fontSize: 11,
                color: isToday ? '#fff' : hasEvent ? '#3b82f6' : '#64748b',
                background: isToday ? '#3b82f6' : hasEvent ? '#eff6ff' : 'transparent',
                fontWeight: isToday || hasEvent ? 600 : 400,
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </SimpleCard>
  ),
};

export function StaticGrid() {
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
