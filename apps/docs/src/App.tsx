import React, { useState } from 'react';
import { BasicGrid } from './examples/BasicGrid';
import { FreeFormCanvas } from './examples/FreeFormCanvas';
import { ResponsiveLayout } from './examples/ResponsiveLayout';
import { DragFromOutside } from './examples/DragFromOutside';
import { CustomItems } from './examples/CustomItems';
import { LargeDataset } from './examples/LargeDataset';
import { NestedGrids } from './examples/NestedGrids';
import { StaticGrid } from './examples/StaticGrid';
import { DarkTheme } from './examples/DarkTheme';
import { EventHandlers } from './examples/EventHandlers';
import { ExampleViewer } from './components/ExampleViewer';

import BasicGridSource from './examples/BasicGrid.tsx?raw';
import FreeFormCanvasSource from './examples/FreeFormCanvas.tsx?raw';
import ResponsiveLayoutSource from './examples/ResponsiveLayout.tsx?raw';
import DragFromOutsideSource from './examples/DragFromOutside.tsx?raw';
import CustomItemsSource from './examples/CustomItems.tsx?raw';
import LargeDatasetSource from './examples/LargeDataset.tsx?raw';
import NestedGridsSource from './examples/NestedGrids.tsx?raw';
import StaticGridSource from './examples/StaticGrid.tsx?raw';
import DarkThemeSource from './examples/DarkTheme.tsx?raw';
import EventHandlersSource from './examples/EventHandlers.tsx?raw';

const EXAMPLES = [
  { id: 'basic', label: 'Basic Grid', description: 'Simple drag & resize with vertical compaction', component: BasicGrid, source: BasicGridSource },
  { id: 'freeform', label: 'Free-Form Canvas', description: 'Infinite canvas with pan/zoom, no compaction', component: FreeFormCanvas, source: FreeFormCanvasSource },
  { id: 'responsive', label: 'Responsive Layout', description: 'Dashboard layout with min width constraints', component: ResponsiveLayout, source: ResponsiveLayoutSource },
  { id: 'drag-outside', label: 'Add Widgets', description: 'Add items from an external palette', component: DragFromOutside, source: DragFromOutsideSource },
  { id: 'custom', label: 'Custom Widgets', description: 'Rich dashboard with custom item renderers', component: CustomItems, source: CustomItemsSource },
  { id: 'static', label: 'Static Items', description: 'Mix of locked and draggable grid items', component: StaticGrid, source: StaticGridSource },
  { id: 'dark', label: 'Dark Theme', description: 'Dark-themed monitoring dashboard', component: DarkTheme, source: DarkThemeSource },
  { id: 'events', label: 'Event Handlers', description: 'Drag, resize, and click event callbacks with live log', component: EventHandlers, source: EventHandlersSource },
  { id: 'large', label: 'Large Dataset', description: 'Performance test with 100-1000 items', component: LargeDataset, source: LargeDatasetSource },
  { id: 'nested', label: 'Nested Grids', description: 'Grid within grid — nested layouts', component: NestedGrids, source: NestedGridsSource },
] as const;

export function App() {
  const [activeId, setActiveId] = useState<string>('basic');
  const activeExample = EXAMPLES.find((e) => e.id === activeId)!;
  const ActiveComponent = activeExample.component;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
          <span style={{ color: '#3b82f6' }}>Grid</span>Canvas
        </h1>
        <span style={{ fontSize: 12, color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4 }}>
          v0.1.0
        </span>
        <div style={{ flex: 1 }} />
        <a
          href="https://github.com/coolzwc/grid-canvas"
          style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </header>

      <div style={{ display: 'flex', maxWidth: 1400, margin: '0 auto', padding: '24px 32px', gap: 24 }}>
        {/* Sidebar */}
        <nav style={{ width: 220, flexShrink: 0 }}>
          <h3 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 600, margin: '0 0 12px', padding: '0 12px' }}>
            Examples
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {EXAMPLES.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveId(example.id)}
                style={{
                  padding: '8px 12px',
                  background: activeId === example.id ? '#eff6ff' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 150ms',
                }}
              >
                <div style={{
                  fontSize: 13,
                  fontWeight: activeId === example.id ? 600 : 400,
                  color: activeId === example.id ? '#3b82f6' : '#475569',
                }}>
                  {example.label}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                  {example.description}
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <ExampleViewer
            key={activeId}
            title={activeExample.label}
            description={activeExample.description}
            code={activeExample.source}
          >
            <ActiveComponent />
          </ExampleViewer>
        </main>
      </div>
    </div>
  );
}
