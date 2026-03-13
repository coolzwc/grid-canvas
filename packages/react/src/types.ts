import type { ComponentType, ReactNode } from 'react';
import type {
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
  PanZoomInstance,
  PositionParams,
  FitViewOptions,
} from '@grid-canvas/core';

// ─── Store Types ─────────────────────────────────────────────────────────────

export interface GridCanvasState {
  // Layout
  items: Layout;
  itemLookup: Map<string, InternalItem>;

  // Viewport
  transform: Transform;
  width: number;
  height: number;
  panZoom: PanZoomInstance | null;
  domNode: HTMLDivElement | null;

  // Interaction
  interactionMode: InteractionMode;
  activeDrag: DragState | null;
  activeResize: ResizeState | null;
  selectedIds: Set<string>;

  // Config
  cols: number;
  rowHeight: number;
  margin: [number, number];
  containerPadding: [number, number];
  maxRows: number;
  compactType: CompactType;
  preventCollision: boolean;
  draggable: boolean;
  resizable: boolean;

  // Actions
  setItems: (items: Layout) => void;
  updateLayout: (layout: Layout) => void;
  setTransform: (transform: Transform) => void;
  setDimensions: (width: number, height: number) => void;
  setPanZoom: (panZoom: PanZoomInstance | null) => void;
  setDomNode: (node: HTMLDivElement) => void;

  startDrag: (drag: DragState) => void;
  updateDrag: (x: number, y: number, pixelLeft?: number, pixelTop?: number) => void;
  endDrag: () => void;

  startResize: (resize: ResizeState) => void;
  updateResize: (w: number, h: number, x?: number, y?: number, pixel?: { width: number; height: number; left: number; top: number }) => void;
  endResize: () => void;

  selectItem: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  setInteractionMode: (mode: InteractionMode) => void;

  panBy: (dx: number, dy: number) => void;
  zoomTo: (zoom: number, center?: { x: number; y: number }) => void;
  fitView: (options?: FitViewOptions) => void;

  getPositionParams: () => PositionParams;
}

// ─── Component Props ─────────────────────────────────────────────────────────

export interface GridCanvasProps {
  children?: ReactNode;
  items: Layout;
  onItemsChange?: (items: Layout) => void;

  // Grid config
  cols?: number;
  rowHeight?: number;
  margin?: [number, number];
  containerPadding?: [number, number];
  maxRows?: number;
  compactType?: CompactType;
  preventCollision?: boolean;

  // Interaction
  draggable?: boolean;
  resizable?: boolean;
  resizeHandles?: ResizeHandleAxis[];
  dragHandle?: string;
  dragCancel?: string;
  dragThreshold?: number;

  // Viewport
  defaultViewport?: Viewport;
  minZoom?: number;
  maxZoom?: number;
  panning?: boolean;
  zooming?: boolean;

  // Interaction mode
  /** Default interaction mode. 'select' enables item dragging, 'hand' enables canvas panning. */
  defaultInteractionMode?: InteractionMode;
  /** Callback when interaction mode changes */
  onInteractionModeChange?: (mode: InteractionMode) => void;

  // Virtualization
  onlyRenderVisibleItems?: boolean;

  // Custom renderers
  itemTypes?: Record<string, ComponentType<ItemComponentProps>>;

  // Callbacks
  onDragStart?: (item: LayoutItem, event: PointerEvent) => void;
  onDrag?: (item: LayoutItem, event: PointerEvent) => void;
  onDragStop?: (item: LayoutItem, event: PointerEvent) => void;
  onResizeStart?: (item: LayoutItem, event: PointerEvent) => void;
  onResize?: (item: LayoutItem, event: PointerEvent) => void;
  onResizeStop?: (item: LayoutItem, event: PointerEvent) => void;
  onViewportChange?: (viewport: Viewport) => void;

  // Style
  className?: string;
  style?: React.CSSProperties;
}

export interface ItemComponentProps {
  item: LayoutItem;
  children?: ReactNode;
  isDragging: boolean;
  isResizing: boolean;
}

export interface BackgroundProps {
  variant?: 'dots' | 'grid' | 'lines';
  gap?: number;
  size?: number;
  color?: string;
  className?: string;
}

export interface ControlsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showZoom?: boolean;
  showFitView?: boolean;
  className?: string;
}

export interface MiniMapProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  width?: number;
  height?: number;
  className?: string;
}

export interface InteractionToolbarProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Show or hide the toolbar */
  show?: boolean;
  className?: string;
}

export interface PanelProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  children?: ReactNode;
  className?: string;
}
