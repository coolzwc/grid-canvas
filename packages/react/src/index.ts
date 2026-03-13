// Components
export { GridCanvas } from './components/GridCanvas';
export { Background } from './components/Background';
export { Controls } from './components/Controls';
export { InteractionToolbar } from './components/InteractionToolbar';
export { MiniMap } from './components/MiniMap';
export { Panel } from './components/Panel';

// Hooks
export { useGridCanvas } from './hooks/useGridCanvas';
export { useViewport } from './hooks/useViewport';
export { useVisibleItems } from './hooks/useVisibleItems';
export { useStore } from './hooks/useStore';

// Context
export { GridCanvasContext, useStoreApi } from './contexts/GridCanvasContext';

// Store
export { createGridCanvasStore } from './store/createStore';
export type { GridCanvasStore } from './store/createStore';

// Types
export type {
  GridCanvasState,
  GridCanvasProps,
  ItemComponentProps,
  BackgroundProps,
  ControlsProps,
  InteractionToolbarProps,
  MiniMapProps,
  PanelProps,
} from './types';

// Re-export core types for convenience
export type {
  Layout,
  LayoutItem,
  InternalItem,
  Transform,
  Viewport,
  CompactType,
  InteractionMode,
  DragState,
  ResizeState,
  ResizeHandleAxis,
  FitViewOptions,
  DroppingItem,
} from '@grid-canvas/core';
