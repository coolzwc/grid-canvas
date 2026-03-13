// ─── Layout Types ────────────────────────────────────────────────────────────

export interface LayoutItem {
  /** Unique identifier */
  i: string;
  /** X position in grid units */
  x: number;
  /** Y position in grid units */
  y: number;
  /** Width in grid units */
  w: number;
  /** Height in grid units */
  h: number;
  /** Item type key (used with itemTypes to render custom components) */
  type?: string;
  /** Minimum width in grid units */
  minW?: number;
  /** Maximum width in grid units */
  maxW?: number;
  /** Minimum height in grid units */
  minH?: number;
  /** Maximum height in grid units */
  maxH?: number;
  /** If true, item cannot be dragged or resized and is not affected by compaction */
  isStatic?: boolean;
  /** Override global draggable setting per item */
  isDraggable?: boolean;
  /** Override global resizable setting per item */
  isResizable?: boolean;
  /** Which resize handles to show */
  resizeHandles?: ResizeHandleAxis[];
}

export type Layout = LayoutItem[];

export interface InternalItem extends LayoutItem {
  /** Pixel position computed from grid position */
  pixelPosition: PixelPosition;
  /** Whether this item is currently being dragged */
  isDragging: boolean;
  /** Whether this item is currently being resized */
  isResizing: boolean;
}

export interface PixelPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ─── Grid Config ─────────────────────────────────────────────────────────────

export interface GridConfig {
  /** Number of columns */
  cols: number;
  /** Row height in pixels */
  rowHeight: number;
  /** Margin between items [horizontal, vertical] in pixels */
  margin: [number, number];
  /** Padding inside the container [horizontal, vertical] in pixels */
  containerPadding: [number, number];
  /** Maximum number of rows */
  maxRows: number;
}

export interface PositionParams {
  margin: [number, number];
  containerPadding: [number, number];
  containerWidth: number;
  cols: number;
  rowHeight: number;
  maxRows: number;
}

// ─── Compaction ──────────────────────────────────────────────────────────────

export type CompactType = 'vertical' | 'horizontal' | null;

/** Interaction mode: 'select' for item manipulation, 'hand' for canvas panning */
export type InteractionMode = 'select' | 'hand';

export interface Compactor {
  type: CompactType;
  compact(layout: Layout, cols: number): Layout;
}

// ─── Canvas / Viewport Types ─────────────────────────────────────────────────

/** [translateX, translateY, scale] */
export type Transform = [number, number, number];

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface XYPosition {
  x: number;
  y: number;
}

export type SnapGrid = [number, number];

export interface CoordinateExtent {
  min: XYPosition;
  max: XYPosition;
}

export interface FitViewOptions {
  padding?: number;
  minZoom?: number;
  maxZoom?: number;
  duration?: number;
}

// ─── Pan/Zoom Types ──────────────────────────────────────────────────────────

export interface PanZoomInstance {
  update(params: PanZoomParams): void;
  destroy(): void;
  setViewport(viewport: Viewport, options?: { duration?: number }): void;
  getViewport(): Viewport;
  syncViewport(viewport: Viewport): void;
}

export interface PanZoomParams {
  minZoom: number;
  maxZoom: number;
  translateExtent?: [[number, number], [number, number]];
  panning: boolean;
  zooming: boolean;
}

export interface PanZoomCallbacks {
  onPanZoomStart?: (event: Event | null, viewport: Viewport) => void;
  onPanZoom?: (event: Event | null, viewport: Viewport) => void;
  onPanZoomEnd?: (event: Event | null, viewport: Viewport) => void;
  onTransformChange?: (transform: Transform) => void;
}

// ─── Drag Types ──────────────────────────────────────────────────────────────

export interface DragState {
  itemId: string;
  /** Current grid position during drag (snapped) */
  x: number;
  y: number;
  /** Original grid position before drag */
  originalX: number;
  originalY: number;
  /** Current pixel offset from pointer down */
  offsetX: number;
  offsetY: number;
  /** Continuous pixel position for smooth rendering (canvas-space) */
  pixelLeft: number;
  pixelTop: number;
}

export interface DragCallbacks {
  onDragStart?: (item: LayoutItem, event: PointerEvent) => void;
  onDrag?: (item: LayoutItem, event: PointerEvent) => void;
  onDragStop?: (item: LayoutItem, event: PointerEvent) => void;
}

export interface DragConfig {
  enabled: boolean;
  handle?: string;
  cancel?: string;
  threshold: number;
}

// ─── Resize Types ────────────────────────────────────────────────────────────

export type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

export interface ResizeState {
  itemId: string;
  w: number;
  h: number;
  originalW: number;
  originalH: number;
  handle: ResizeHandleAxis;
  /** Continuous pixel dimensions for smooth rendering (canvas-space) */
  pixelWidth: number;
  pixelHeight: number;
  /** Continuous pixel position for west/north handles */
  pixelLeft: number;
  pixelTop: number;
}

export interface ResizeCallbacks {
  onResizeStart?: (item: LayoutItem, event: PointerEvent) => void;
  onResize?: (item: LayoutItem, event: PointerEvent) => void;
  onResizeStop?: (item: LayoutItem, event: PointerEvent) => void;
}

export interface ResizeConfig {
  enabled: boolean;
  handles: ResizeHandleAxis[];
}

// ─── Drop Types ──────────────────────────────────────────────────────────────

export interface DroppingItem {
  i: string;
  w: number;
  h: number;
}

// ─── Utility Types ───────────────────────────────────────────────────────────

export type Mutable<T> = { -readonly [P in keyof T]: T[P] };
