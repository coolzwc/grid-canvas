# GridCanvas

**English** | [中文](README.zh-CN.md)

**[Live Demo →](https://coolzwc.github.io/grid-canvas/)**

A high-performance, extensible React grid layout library with infinite canvas, pan/zoom, drag-and-drop, and resize capabilities.

## Features

- **Grid-based layout** with configurable columns, row height, margins, and padding
- **Drag and drop** with grid snapping, threshold detection, and customizable handles
- **Resize** from any edge or corner with min/max constraints
- **Infinite canvas** with smooth pan and zoom (powered by d3-zoom)
- **Vertical & horizontal compaction** or free-form layout (no compaction)
- **Viewport culling** for rendering only visible items (scales to 1000+ items)
- **Composable plugins**: Background, Controls, MiniMap, InteractionToolbar, Panel as child components
- **Custom item types** via `itemTypes` prop
- **Nested grids** supported out of the box
- **TypeScript-first** with full type safety
- **Framework-agnostic core** (`@grid-canvas/core`) for use without React
- **Zero-dependency drag/resize** (no react-draggable or react-resizable)
- **Lightweight** (~34KB minified for the React package)

## Installation

```bash
# npm
npm install @grid-canvas/react

# pnpm
pnpm add @grid-canvas/react

# yarn
yarn add @grid-canvas/react
```

React 18+ is required.

## Quick Start

```tsx
import { useState } from "react";
import {
  GridCanvas,
  Background,
  Controls,
  type Layout,
} from "@grid-canvas/react";

function App() {
  const [items, setItems] = useState<Layout>([
    { i: "a", x: 0, y: 0, w: 4, h: 2 },
    { i: "b", x: 4, y: 0, w: 4, h: 3 },
    { i: "c", x: 8, y: 0, w: 4, h: 2 },
  ]);

  return (
    <div style={{ width: "100%", height: 500 }}>
      <GridCanvas
        items={items}
        onItemsChange={setItems}
        cols={12}
        rowHeight={60}
      >
        <div key="a">Widget A</div>
        <div key="b">Widget B</div>
        <div key="c">Widget C</div>
        <Background variant="dots" />
        <Controls />
      </GridCanvas>
    </div>
  );
}
```

---

## API Reference

### `<GridCanvas>`

The main container component. All grid items and plugin components must be placed as children.

#### Layout Props

| Prop               | Type                                 | Default      | Description                                                                                                                                                                                                       |
| ------------------ | ------------------------------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `Layout` (i.e. `LayoutItem[]`)       | **required** | Array of layout items defining each item's position and size in the grid. Each item must have a unique `i` identifier.                                                                                            |
| `onItemsChange`    | `(items: Layout) => void`            | `undefined`  | Callback fired whenever the layout changes (after drag, resize, or compaction). Receives the complete updated layout array. Use this to sync state: `onItemsChange={setItems}`.                                   |
| `cols`             | `number`                             | `12`         | Number of columns in the grid. Items' `x` and `w` values are in grid units relative to this. For example, with `cols={12}`, an item with `w: 6` occupies half the container width.                                |
| `rowHeight`        | `number`                             | `60`         | Height of one grid row in pixels. An item with `h: 2` will be `2 × 60 = 120px` tall (before accounting for margins).                                                                                              |
| `margin`           | `[number, number]`                   | `[10, 10]`   | Gap between items in pixels as `[horizontal, vertical]`. The first value is the horizontal gap between columns; the second is the vertical gap between rows.                                                      |
| `containerPadding` | `[number, number]`                   | `[10, 10]`   | Inner padding of the grid container in pixels as `[horizontal, vertical]`. This is the space between the container edge and the first/last items.                                                                 |
| `maxRows`          | `number`                             | `Infinity`   | Maximum number of rows the grid can grow to. Items cannot be placed or dragged beyond this limit. Set to `Infinity` for unbounded vertical growth.                                                                |
| `compactType`      | `'vertical' \| 'horizontal' \| null` | `'vertical'` | Compaction direction. `'vertical'` pushes items upward to fill gaps (like gravity). `'horizontal'` pushes items leftward. `null` disables compaction entirely — items stay exactly where placed (free-form mode). |
| `preventCollision` | `boolean`                            | `false`      | When `true`, items cannot overlap. Dragging an item onto another will be prevented rather than pushing the other item. Only meaningful when `compactType` is `null`.                                              |

#### Interaction Props

| Prop                      | Type                              | Default     | Description                                                                                                                                                                                                                                                                           |
| ------------------------- | --------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `draggable`               | `boolean`                         | `true`      | Enable or disable drag globally for all items. When `false`, no items can be dragged. Individual items can override this via `isDraggable`.                                                                                                                                           |
| `resizable`               | `boolean`                         | `true`      | Enable or disable resize globally for all items. When `false`, no resize handles appear. Individual items can override this via `isResizable`.                                                                                                                                        |
| `resizeHandles`           | `ResizeHandleAxis[]`              | `['se']`    | Which resize handles to show on items. Possible values: `'s'` (south/bottom), `'w'` (west/left), `'e'` (east/right), `'n'` (north/top), `'sw'` (south-west), `'nw'` (north-west), `'se'` (south-east), `'ne'` (north-east). Example: `['se', 'sw', 'ne', 'nw']` for all four corners. |
| `dragHandle`              | `string`                          | `undefined` | CSS selector for the drag handle element within each item. When set, items can only be dragged by clicking on elements matching this selector. Example: `dragHandle=".my-handle"`.                                                                                                    |
| `dragCancel`              | `string`                          | `undefined` | CSS selector for elements that should prevent drag from starting. Clicking on matching elements will not initiate a drag even if inside the drag handle area. Example: `dragCancel=".no-drag"`.                                                                                       |
| `dragThreshold`           | `number`                          | `3`         | Number of pixels the pointer must move before a drag operation begins. Prevents accidental drags when clicking items. Higher values require more deliberate movement to start dragging.                                                                                               |
| `defaultInteractionMode`  | `'select' \| 'hand'`              | `'select'`  | Initial interaction mode. `'select'` enables item dragging/resizing on pointer down. `'hand'` enables canvas panning on pointer down (items cannot be dragged). Can be switched at runtime via `InteractionToolbar` or the `useGridCanvas` hook.                                      |
| `onInteractionModeChange` | `(mode: InteractionMode) => void` | `undefined` | Callback fired when the interaction mode changes (e.g. user clicks the InteractionToolbar). Receives `'select'` or `'hand'`.                                                                                                                                                          |

#### Viewport Props

| Prop              | Type       | Default                   | Description                                                                                                                                                                               |
| ----------------- | ---------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultViewport` | `Viewport` | `{ x: 0, y: 0, zoom: 1 }` | Initial viewport state. `x` and `y` are the pan offset in pixels. `zoom` is the scale factor (1 = 100%). Example: `{ x: -100, y: -50, zoom: 0.8 }` starts the view panned and zoomed out. |
| `minZoom`         | `number`   | `0.1`                     | Minimum allowed zoom level. `0.1` means the canvas can be zoomed out to 10% of its original size. Cannot be less than 0.01.                                                               |
| `maxZoom`         | `number`   | `4`                       | Maximum allowed zoom level. `4` means the canvas can be zoomed in to 400%.                                                                                                                |
| `panning`         | `boolean`  | `false`                   | Enable or disable canvas panning. When `true`, users can pan the canvas by clicking and dragging on empty areas (or everywhere in `'hand'` mode).                                         |
| `zooming`         | `boolean`  | `false`                   | Enable or disable canvas zooming. When `true`, users can zoom with the scroll wheel or pinch gesture.                                                                                     |

#### Virtualization Props

| Prop                     | Type      | Default | Description                                                                                                                                                                                                                                                                            |
| ------------------------ | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onlyRenderVisibleItems` | `boolean` | `false` | When `true`, only items visible within the current viewport are rendered to the DOM. Items outside the viewport are unmounted. This dramatically improves performance for large layouts (1000+ items). Actively dragged or resized items are always rendered regardless of visibility. |

#### Custom Renderer Props

| Prop        | Type                                                | Default     | Description                                                                                                                                                                                                                                           |
| ----------- | --------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `itemTypes` | `Record<string, ComponentType<ItemComponentProps>>` | `undefined` | Map of item type keys to custom React components. When a `LayoutItem` has a `type` field (e.g. `type: 'chart'`), the corresponding component from this map is rendered. The component receives `{ item, children, isDragging, isResizing }` as props. |

#### Event Callback Props

| Prop               | Type                                              | Default     | Description                                                                                                                                                         |
| ------------------ | ------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onDragStart`      | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | Fired when a drag operation begins. `item` is the layout item being dragged (with its current position). `event` is the native `PointerEvent`.                      |
| `onDrag`           | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | Fired continuously as an item is dragged. Called on every pointer move during a drag. `item` contains the item's current snapped grid position.                     |
| `onDragStop`       | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | Fired when a drag operation ends (pointer released). `item` contains the item's final position.                                                                     |
| `onResizeStart`    | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | Fired when a resize operation begins. `item` is the layout item being resized.                                                                                      |
| `onResize`         | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | Fired continuously as an item is resized. `item` contains the item's current size.                                                                                  |
| `onResizeStop`     | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | Fired when a resize operation ends. `item` contains the item's final size.                                                                                          |
| `onViewportChange` | `(viewport: Viewport) => void`                    | `undefined` | Fired when the viewport changes (pan or zoom). `viewport` is `{ x: number, y: number, zoom: number }`. Useful for persisting viewport state or syncing external UI. |

#### Style Props

| Prop        | Type                  | Default     | Description                                                                                                                                |
| ----------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `className` | `string`              | `undefined` | CSS class name applied to the root container element. The container always has the `gc-container` class.                                   |
| `style`     | `React.CSSProperties` | `undefined` | Inline styles merged onto the root container. The container defaults to `position: relative; width: 100%; height: 100%; overflow: hidden`. |

---

### `LayoutItem`

Defines the position, size, and behavior of a single grid item.

```typescript
interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type?: string;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  isStatic?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;
  resizeHandles?: ResizeHandleAxis[];
}
```

| Property        | Type                 | Default      | Description                                                                                                                                                                                                                                 |
| --------------- | -------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `i`             | `string`             | **required** | Unique identifier for the item. Must be unique across all items in the layout. Used as the React key and for internal lookups.                                                                                                              |
| `x`             | `number`             | **required** | Horizontal position in grid units (0-indexed from the left). With `cols=12`, valid values are `0` through `11`.                                                                                                                             |
| `y`             | `number`             | **required** | Vertical position in grid units (0-indexed from the top). Use `Infinity` to append an item at the bottom of the layout.                                                                                                                     |
| `w`             | `number`             | **required** | Width in grid units. With `cols=12`, `w: 6` means the item spans half the grid width. Minimum effective value is `1`.                                                                                                                       |
| `h`             | `number`             | **required** | Height in grid units. `h: 2` means the item is 2 rows tall. The pixel height is `h × rowHeight + (h - 1) × margin[1]`. Minimum effective value is `1`.                                                                                      |
| `type`          | `string`             | `undefined`  | Item type key used to look up a custom renderer from the `itemTypes` prop on `<GridCanvas>`. When set, the corresponding component is rendered instead of the default children.                                                             |
| `minW`          | `number`             | `1`          | Minimum width in grid units. The item cannot be resized smaller than this width.                                                                                                                                                            |
| `maxW`          | `number`             | `Infinity`   | Maximum width in grid units. The item cannot be resized larger than this width. Clamped to `cols`.                                                                                                                                          |
| `minH`          | `number`             | `1`          | Minimum height in grid units. The item cannot be resized shorter than this height.                                                                                                                                                          |
| `maxH`          | `number`             | `Infinity`   | Maximum height in grid units. The item cannot be resized taller than this height.                                                                                                                                                           |
| `isStatic`      | `boolean`            | `false`      | When `true`, the item cannot be dragged, resized, or moved by compaction. It acts as a fixed obstacle that other items flow around. Useful for headers, footers, or locked widgets.                                                         |
| `isDraggable`   | `boolean`            | `undefined`  | Per-item override for the global `draggable` prop. `true` makes this item draggable even if `draggable={false}` globally. `false` prevents dragging this item even if `draggable={true}` globally. `undefined` inherits the global setting. |
| `isResizable`   | `boolean`            | `undefined`  | Per-item override for the global `resizable` prop. Works the same way as `isDraggable` — `true`/`false` overrides the global setting, `undefined` inherits it.                                                                              |
| `resizeHandles` | `ResizeHandleAxis[]` | `undefined`  | Per-item override for which resize handles to show. When set, overrides the global `resizeHandles` prop. See `ResizeHandleAxis` for valid values.                                                                                           |

### `ResizeHandleAxis`

```typescript
type ResizeHandleAxis = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
```

| Value  | Position            | Description                                          |
| ------ | ------------------- | ---------------------------------------------------- |
| `'s'`  | Bottom center       | Resize by dragging the bottom edge                   |
| `'n'`  | Top center          | Resize by dragging the top edge                      |
| `'e'`  | Right center        | Resize by dragging the right edge                    |
| `'w'`  | Left center         | Resize by dragging the left edge                     |
| `'se'` | Bottom-right corner | Resize by dragging the bottom-right corner (default) |
| `'sw'` | Bottom-left corner  | Resize by dragging the bottom-left corner            |
| `'ne'` | Top-right corner    | Resize by dragging the top-right corner              |
| `'nw'` | Top-left corner     | Resize by dragging the top-left corner               |

### `Viewport`

Represents the pan/zoom state of the canvas.

```typescript
interface Viewport {
  x: number; // Horizontal pan offset in pixels (positive = panned right)
  y: number; // Vertical pan offset in pixels (positive = panned down)
  zoom: number; // Scale factor (1 = 100%, 0.5 = 50%, 2 = 200%)
}
```

### `FitViewOptions`

Options for the `fitView()` method.

```typescript
interface FitViewOptions {
  padding?: number; // Extra padding around the content (default: 0.1, meaning 10% of the viewport)
  minZoom?: number; // Minimum zoom level for the fit (default: inherits from GridCanvas)
  maxZoom?: number; // Maximum zoom level for the fit (default: inherits from GridCanvas)
  duration?: number; // Animation duration in milliseconds (default: 0, instant)
}
```

### `ItemComponentProps`

Props passed to custom item type components (used with `itemTypes`).

```typescript
interface ItemComponentProps {
  item: LayoutItem; // The layout item data
  children?: ReactNode; // Any children passed inside the item's element
  isDragging: boolean; // Whether this item is currently being dragged
  isResizing: boolean; // Whether this item is currently being resized
}
```

### `Transform`

Internal representation of the viewport as a tuple. Used by the store and lower-level APIs.

```typescript
type Transform = [number, number, number]; // [translateX, translateY, scale]
```

---

### Plugin Components

Plugin components are placed as direct children of `<GridCanvas>`. They render as fixed-position overlays outside the pan/zoom viewport.

#### `<Background>`

Renders a repeating pattern background inside the canvas. The pattern moves and scales with the viewport.

| Prop        | Type                          | Default                            | Description                                                                                                                                                       |
| ----------- | ----------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`   | `'dots' \| 'grid' \| 'lines'` | `'dots'`                           | Pattern type. `'dots'` renders circular dots at intersections. `'grid'` renders a grid of horizontal and vertical lines. `'lines'` renders only horizontal lines. |
| `gap`       | `number`                      | `20`                               | Spacing between pattern elements in pixels (at zoom level 1). This value is multiplied by the current zoom level to maintain visual consistency.                  |
| `size`      | `number`                      | `1.5` for dots, `1` for grid/lines | Size of the pattern element. For `'dots'` this is the circle radius. For `'grid'` and `'lines'` this is the stroke width.                                         |
| `color`     | `string`                      | `'rgba(0, 0, 0, 0.08)'`            | CSS color of the pattern. Use lower opacity for subtle backgrounds. Example: `'rgba(0,0,0,0.04)'` for a very subtle pattern.                                      |
| `className` | `string`                      | `''`                               | Additional CSS class name. The component always has `gc-background`.                                                                                              |

#### `<Controls>`

Floating toolbar with zoom in, zoom out, and fit-to-view buttons.

| Prop          | Type                                                           | Default         | Description                                                                                                                                                                              |
| ------------- | -------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `position`    | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-left'` | Corner of the container to place the controls. Offset from the edge by 10px.                                                                                                             |
| `showZoom`    | `boolean`                                                      | `true`          | Show the zoom-in (`+`) and zoom-out (`−`) buttons. Each click changes the zoom by ±0.2.                                                                                                  |
| `showFitView` | `boolean`                                                      | `true`          | Show the fit-to-view button. Clicking it zooms and pans to fit all items in the viewport.                                                                                                |
| `className`   | `string`                                                       | `''`            | Additional CSS class name. The component always has `gc-controls`. Individual buttons have `gc-controls__btn`, `gc-controls__zoom-in`, `gc-controls__zoom-out`, `gc-controls__fit-view`. |

#### `<MiniMap>`

A small overview map showing all items and the current visible viewport area. Items are drawn as blue rectangles; the viewport is drawn as a red outline.

| Prop        | Type                                                           | Default          | Description                                                                  |
| ----------- | -------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------- |
| `position`  | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Corner of the container to place the mini map. Offset from the edge by 10px. |
| `width`     | `number`                                                       | `180`            | Width of the mini map in pixels.                                             |
| `height`    | `number`                                                       | `120`            | Height of the mini map in pixels.                                            |
| `className` | `string`                                                       | `''`             | Additional CSS class name. The component always has `gc-minimap`.            |

#### `<InteractionToolbar>`

A toggle toolbar for switching between `'select'` mode (drag items) and `'hand'` mode (pan canvas).

| Prop        | Type                                                           | Default         | Description                                                                                                                            |
| ----------- | -------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `position`  | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-left'` | Corner of the container to place the toolbar. Offset from the edge by 10px.                                                            |
| `show`      | `boolean`                                                      | `true`          | Whether to render the toolbar. When `false`, the component returns `null`.                                                             |
| `className` | `string`                                                       | `''`            | Additional CSS class name. The component always has `gc-interaction-toolbar`. Active button has `gc-interaction-toolbar__btn--active`. |

#### `<Panel>`

A generic positioned overlay panel for rendering arbitrary content (e.g. custom zoom indicators, legends, status bars).

| Prop        | Type                                                           | Default      | Description                                                               |
| ----------- | -------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `position`  | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | **required** | Corner of the container to place the panel. Offset from the edge by 10px. |
| `children`  | `ReactNode`                                                    | `undefined`  | Content to render inside the panel.                                       |
| `className` | `string`                                                       | `''`         | Additional CSS class name. The component always has `gc-panel`.           |

---

### Hooks

All hooks must be used within a `<GridCanvas>` component (they read from the `GridCanvasContext`).

#### `useGridCanvas()`

Imperative API for controlling the grid canvas. Returns an object with methods (not reactive — methods read state at call time).

```typescript
const api = useGridCanvas();
```

| Method           | Signature                            | Description                                                                            |
| ---------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `getItems`       | `() => Layout`                       | Returns the current layout array.                                                      |
| `setItems`       | `(items: Layout) => void`            | Replaces the entire layout. Triggers compaction and re-render.                         |
| `getViewport`    | `() => Viewport`                     | Returns the current viewport `{ x, y, zoom }`.                                         |
| `setViewport`    | `(viewport: Viewport) => void`       | Sets the viewport to specific pan/zoom values. Animatable via the pan-zoom engine.     |
| `fitView`        | `(options?: FitViewOptions) => void` | Zooms and pans to fit all items within the viewport. See `FitViewOptions` for options. |
| `zoomIn`         | `(step?: number) => void`            | Increases zoom by `step` (default `0.2`). Clamped to `maxZoom`.                        |
| `zoomOut`        | `(step?: number) => void`            | Decreases zoom by `step` (default `0.2`). Clamped to `minZoom` (minimum `0.1`).        |
| `panBy`          | `(dx: number, dy: number) => void`   | Pans the canvas by `dx` pixels horizontally and `dy` pixels vertically.                |
| `getSelectedIds` | `() => string[]`                     | Returns an array of currently selected item IDs.                                       |
| `clearSelection` | `() => void`                         | Deselects all items.                                                                   |

#### `useViewport()`

Reactive access to viewport state. Re-renders the component when the viewport changes.

```typescript
const { viewport, transform, panBy, zoomTo, fitView } = useViewport();
```

| Return      | Type                                                        | Description                                                                                           |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `viewport`  | `Viewport`                                                  | Current viewport as `{ x, y, zoom }`. Reactive — component re-renders on viewport change.             |
| `transform` | `Transform`                                                 | Raw transform tuple `[translateX, translateY, scale]`. Useful for low-level positioning calculations. |
| `panBy`     | `(dx: number, dy: number) => void`                          | Pan the canvas by a pixel delta.                                                                      |
| `zoomTo`    | `(zoom: number, center?: { x: number; y: number }) => void` | Set the zoom level. Optionally specify a center point for the zoom.                                   |
| `fitView`   | `(options?: FitViewOptions) => void`                        | Fit all items in the viewport.                                                                        |

#### `useVisibleItems(onlyVisible: boolean)`

Returns an array of item IDs that are currently visible in the viewport. Used internally by the `ItemRenderer`, but available for custom rendering logic.

```typescript
const visibleIds: string[] = useVisibleItems(true);
```

| Parameter     | Type      | Description                                                                                                                                                        |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onlyVisible` | `boolean` | When `true`, filters items to only those overlapping the current viewport. When `false`, returns all item IDs. Actively dragged/resized items are always included. |

#### `useStore(selector)`

Direct Zustand store access with a selector function. The component re-renders only when the selected value changes (shallow comparison).

```typescript
const items = useStore((s) => s.items);
const transform = useStore((s) => s.transform);
const cols = useStore((s) => s.cols);
const isDragging = useStore((s) => s.activeDrag !== null);
```

The full `GridCanvasState` type is available for the selector. Key state properties:

| Property           | Type                        | Description                                                         |
| ------------------ | --------------------------- | ------------------------------------------------------------------- |
| `items`            | `Layout`                    | Current layout array.                                               |
| `itemLookup`       | `Map<string, InternalItem>` | Map of item ID → internal item (includes computed pixel positions). |
| `transform`        | `Transform`                 | Current viewport transform `[tx, ty, scale]`.                       |
| `width`            | `number`                    | Container width in pixels.                                          |
| `height`           | `number`                    | Container height in pixels.                                         |
| `interactionMode`  | `'select' \| 'hand'`        | Current interaction mode.                                           |
| `activeDrag`       | `DragState \| null`         | Active drag state, or `null` if not dragging.                       |
| `activeResize`     | `ResizeState \| null`       | Active resize state, or `null` if not resizing.                     |
| `selectedIds`      | `Set<string>`               | Set of currently selected item IDs.                                 |
| `cols`             | `number`                    | Current column count.                                               |
| `rowHeight`        | `number`                    | Current row height.                                                 |
| `margin`           | `[number, number]`          | Current margin.                                                     |
| `containerPadding` | `[number, number]`          | Current container padding.                                          |
| `compactType`      | `CompactType`               | Current compaction type.                                            |
| `draggable`        | `boolean`                   | Global draggable flag.                                              |
| `resizable`        | `boolean`                   | Global resizable flag.                                              |

Key store actions (also accessible via the selector):

| Action               | Signature                                                               | Description                                              |
| -------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------- |
| `setItems`           | `(items: Layout) => void`                                               | Replace the layout.                                      |
| `updateLayout`       | `(layout: Layout) => void`                                              | Update layout with compaction.                           |
| `setTransform`       | `(transform: Transform) => void`                                        | Set the viewport transform.                              |
| `startDrag`          | `(drag: DragState) => void`                                             | Begin a drag operation.                                  |
| `updateDrag`         | `(x: number, y: number, pixelLeft?: number, pixelTop?: number) => void` | Update drag position.                                    |
| `endDrag`            | `() => void`                                                            | End the current drag.                                    |
| `startResize`        | `(resize: ResizeState) => void`                                         | Begin a resize operation.                                |
| `updateResize`       | `(w, h, x?, y?, pixel?) => void`                                        | Update resize dimensions.                                |
| `endResize`          | `() => void`                                                            | End the current resize.                                  |
| `selectItem`         | `(id: string, multi?: boolean) => void`                                 | Select an item. If `multi` is `true`, adds to selection. |
| `clearSelection`     | `() => void`                                                            | Clear all selections.                                    |
| `setInteractionMode` | `(mode: InteractionMode) => void`                                       | Switch interaction mode.                                 |
| `panBy`              | `(dx: number, dy: number) => void`                                      | Pan the viewport.                                        |
| `zoomTo`             | `(zoom: number, center?: { x, y }) => void`                             | Set zoom level.                                          |
| `fitView`            | `(options?: FitViewOptions) => void`                                    | Fit all items in the viewport.                           |
| `getPositionParams`  | `() => PositionParams`                                                  | Get current position calculation parameters.             |

#### `useStoreApi()`

Returns the raw Zustand store instance for non-reactive access (useful in callbacks and effects).

```typescript
const store = useStoreApi();

// Read state imperatively (does not trigger re-render)
const currentItems = store.getState().items;

// Subscribe to changes
const unsub = store.subscribe((state, prevState) => {
  if (state.items !== prevState.items) {
    console.log("Layout changed");
  }
});
```

---

### Context

#### `GridCanvasContext`

React context holding the Zustand store. Automatically provided by `<GridCanvas>`. You only need this if building entirely custom components that live outside the `<GridCanvas>` tree.

```typescript
import { GridCanvasContext } from "@grid-canvas/react";

// Access the store from context
const store = useContext(GridCanvasContext);
```

---

## Examples

### Free-Form Canvas (No Compaction)

```tsx
<GridCanvas
  items={items}
  onItemsChange={setItems}
  cols={24}
  rowHeight={40}
  compactType={null}
  panning
  zooming
  minZoom={0.25}
  maxZoom={3}
>
  {items.map((item) => (
    <div key={item.i}>Sticky Note</div>
  ))}
  <Background variant="grid" gap={40} />
  <MiniMap />
</GridCanvas>
```

### Dashboard with Custom Widgets

```tsx
<GridCanvas items={items} onItemsChange={setItems} cols={12} rowHeight={60}>
  <div key="chart">
    <ChartWidget />
  </div>
  <div key="metrics">
    <MetricsWidget />
  </div>
  <div key="logs">
    <LogWidget />
  </div>
  <Background variant="dots" />
  <Controls />
</GridCanvas>
```

### Static (Locked) Items

```tsx
const items: Layout = [
  { i: "header", x: 0, y: 0, w: 12, h: 1, isStatic: true },
  { i: "content", x: 0, y: 1, w: 8, h: 4 },
  { i: "sidebar", x: 8, y: 1, w: 4, h: 4 },
  { i: "footer", x: 0, y: 5, w: 12, h: 1, isStatic: true },
];
```

### Event Handling

```tsx
<GridCanvas
  items={items}
  onItemsChange={setItems}
  onDragStart={(item, e) => console.log("Drag started:", item.i)}
  onDragStop={(item, e) =>
    console.log("Drag ended:", item.i, "→", item.x, item.y)
  }
  onResizeStop={(item, e) =>
    console.log("Resized:", item.i, "→", item.w, "×", item.h)
  }
  onViewportChange={(vp) => console.log("Viewport:", vp.zoom)}
/>
```

### Large Dataset with Virtualization

```tsx
<GridCanvas
  items={thousandItems}
  onItemsChange={setItems}
  onlyRenderVisibleItems
  panning
  zooming
  minZoom={0.1}
  maxZoom={3}
>
  {thousandItems.map((item) => (
    <div key={item.i}>{item.i}</div>
  ))}
  <MiniMap />
</GridCanvas>
```

### Nested Grids

```tsx
<GridCanvas items={outerItems} onItemsChange={setOuterItems} cols={12}>
  <div key="panel-a">
    <GridCanvas
      items={innerItems}
      onItemsChange={setInnerItems}
      cols={4}
      panning={false}
      zooming={false}
    >
      {innerItems.map((item) => (
        <div key={item.i}>{item.i}</div>
      ))}
    </GridCanvas>
  </div>
</GridCanvas>
```

### Interaction Mode Toggle

```tsx
<GridCanvas
  items={items}
  onItemsChange={setItems}
  panning
  zooming
  defaultInteractionMode="select"
  onInteractionModeChange={(mode) => console.log("Mode:", mode)}
>
  {items.map((item) => (
    <div key={item.i}>{item.i}</div>
  ))}
  <InteractionToolbar position="top-left" />
  <Controls position="bottom-left" />
</GridCanvas>
```

---

## Core Package (Headless)

For non-React use cases, use `@grid-canvas/core` directly:

```bash
npm install @grid-canvas/core
```

### Grid Engine

Functions for layout calculation, collision detection, and compaction.

| Function                  | Signature                                           | Description                                                                                     |
| ------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `calcGridColWidth`        | `(params: PositionParams) => number`                | Calculate the pixel width of a single column given container width, cols, margins, and padding. |
| `calcGridItemPosition`    | `(params, x, y, w, h) => PixelPosition`             | Convert grid coordinates to pixel position `{ left, top, width, height }`.                      |
| `calcXY`                  | `(params, top, left) => { x, y }`                   | Convert pixel coordinates back to grid coordinates.                                             |
| `calcWH`                  | `(params, width, height) => { w, h }`               | Convert pixel dimensions to grid units.                                                         |
| `collides`                | `(a: LayoutItem, b: LayoutItem) => boolean`         | Check if two layout items overlap.                                                              |
| `getFirstCollision`       | `(layout, item) => LayoutItem \| undefined`         | Find the first item in the layout that collides with the given item.                            |
| `getAllCollisions`        | `(layout, item) => LayoutItem[]`                    | Find all items in the layout that collide with the given item.                                  |
| `moveElement`             | `(layout, item, x, y, isUserAction, ...) => Layout` | Move an item to a new position, handling collisions and compaction.                             |
| `getCompactor`            | `(type: CompactType) => Compactor`                  | Get a compactor instance for the given compaction type.                                         |
| `verticalCompactor`       | `Compactor`                                         | Built-in vertical compactor.                                                                    |
| `horizontalCompactor`     | `Compactor`                                         | Built-in horizontal compactor.                                                                  |
| `noCompactor`             | `Compactor`                                         | No-op compactor (returns layout unchanged).                                                     |
| `cloneLayout`             | `(layout: Layout) => Layout`                        | Deep clone a layout array.                                                                      |
| `cloneLayoutItem`         | `(item: LayoutItem) => LayoutItem`                  | Deep clone a layout item.                                                                       |
| `getLayoutItem`           | `(layout, id) => LayoutItem \| undefined`           | Find an item by ID.                                                                             |
| `bottom`                  | `(layout: Layout) => number`                        | Find the bottom-most Y coordinate across all items.                                             |
| `validateLayout`          | `(layout, contextName?) => Layout`                  | Validate and normalize a layout (ensures no negative positions, etc.).                          |
| `sortLayoutItemsByRowCol` | `(a, b) => number`                                  | Sort comparator: top-to-bottom, left-to-right.                                                  |
| `sortLayoutItemsByColRow` | `(a, b) => number`                                  | Sort comparator: left-to-right, top-to-bottom.                                                  |

### Canvas Engine

Functions for coordinate transforms, viewport math, and pan/zoom.

| Function               | Signature                                                        | Description                                                                                     |
| ---------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `viewportToTransform`  | `(viewport: Viewport) => Transform`                              | Convert `{ x, y, zoom }` to `[tx, ty, scale]`.                                                  |
| `transformToViewport`  | `(transform: Transform) => Viewport`                             | Convert `[tx, ty, scale]` to `{ x, y, zoom }`.                                                  |
| `screenToCanvas`       | `(point, transform) => { x, y }`                                 | Convert screen (DOM) coordinates to canvas coordinates accounting for current pan/zoom.         |
| `canvasToScreen`       | `(point, transform) => { x, y }`                                 | Convert canvas coordinates to screen (DOM) coordinates.                                         |
| `snapPosition`         | `(x, y, snapGrid) => { x, y }`                                   | Snap coordinates to a grid.                                                                     |
| `getVisibleRect`       | `(width, height, transform) => Rect`                             | Calculate the visible rectangle in canvas coordinates for a given container size and transform. |
| `getViewportForBounds` | `(bounds, width, height, minZoom, maxZoom, padding) => Viewport` | Calculate the viewport that fits the given bounds within the container.                         |
| `rectsOverlap`         | `(a: Rect, b: Rect) => boolean`                                  | Check if two rectangles overlap.                                                                |
| `getBoundsOfRects`     | `(rects: Rect[]) => Rect`                                        | Get the bounding rectangle of a set of rectangles.                                              |
| `createPanZoom`        | `(options: PanZoomOptions) => PanZoomInstance`                   | Create a pan/zoom controller on a DOM element (uses d3-zoom internally).                        |

### Drag & Resize

| Function              | Signature                                    | Description                                                                        |
| --------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- |
| `createDragHandler`   | `(options: DragHandlerOptions) => { ... }`   | Create a drag handler with pointer event management.                               |
| `snapToGridPosition`  | `(x, y, colWidth, rowHeight) => { x, y }`    | Snap pixel coordinates to the nearest grid position.                               |
| `createResizeHandler` | `(options: ResizeHandlerOptions) => { ... }` | Create a resize handler with pointer event management.                             |
| `getSizeConstraints`  | `(item, cols) => SizeConstraints`            | Get min/max size constraints for an item based on its properties and column count. |
| `constrainSize`       | `(w, h, constraints) => { w, h }`            | Clamp width and height to the given constraints.                                   |

### Utilities

| Function              | Signature                                      | Description                                                           |
| --------------------- | ---------------------------------------------- | --------------------------------------------------------------------- |
| `getRelativePosition` | `(event, container) => { x, y }`               | Get event position relative to a container element.                   |
| `setTransformStyle`   | `(element, x, y, scale?) => void`              | Apply CSS `transform: translate3d()` to an element.                   |
| `setTopLeftStyle`     | `(element, top, left, width, height) => void`  | Apply `top`, `left`, `width`, `height` styles.                        |
| `clamp`               | `(value, min, max) => number`                  | Clamp a number between min and max.                                   |
| `lerp`                | `(a, b, t) => number`                          | Linear interpolation between a and b.                                 |
| `distance`            | `(x1, y1, x2, y2) => number`                   | Euclidean distance between two points.                                |
| `adoptItems`          | `(items, config) => Map<string, InternalItem>` | Convert layout items to internal items with computed pixel positions. |
| `getItemRects`        | `(items, params) => Rect[]`                    | Get pixel rectangles for all items in a layout.                       |

### Constants

| Constant                    | Value                                            | Description                                         |
| --------------------------- | ------------------------------------------------ | --------------------------------------------------- |
| `DEFAULT_COLS`              | `12`                                             | Default column count.                               |
| `DEFAULT_ROW_HEIGHT`        | `60`                                             | Default row height in pixels.                       |
| `DEFAULT_MARGIN`            | `[10, 10]`                                       | Default margin `[horizontal, vertical]`.            |
| `DEFAULT_CONTAINER_PADDING` | `[10, 10]`                                       | Default container padding `[horizontal, vertical]`. |
| `DEFAULT_MAX_ROWS`          | `Infinity`                                       | Default max rows.                                   |
| `DEFAULT_MIN_ZOOM`          | `0.1`                                            | Default minimum zoom (10%).                         |
| `DEFAULT_MAX_ZOOM`          | `4`                                              | Default maximum zoom (400%).                        |
| `DEFAULT_DRAG_THRESHOLD`    | `3`                                              | Default drag threshold in pixels.                   |
| `DEFAULT_RESIZE_HANDLES`    | `['se']`                                         | Default resize handles (south-east corner only).    |
| `INFINITE_EXTENT`           | `[[-Infinity, -Infinity], [Infinity, Infinity]]` | Unbounded translate extent for pan/zoom.            |

---

## CSS Class Reference

All components use BEM-style class names prefixed with `gc-` for custom styling.

| Class                                 | Component          | Description               |
| ------------------------------------- | ------------------ | ------------------------- |
| `gc-container`                        | GridCanvas         | Root container element    |
| `gc-background`                       | Background         | Background SVG element    |
| `gc-controls`                         | Controls           | Controls wrapper          |
| `gc-controls__btn`                    | Controls           | Individual control button |
| `gc-controls__zoom-in`                | Controls           | Zoom in button            |
| `gc-controls__zoom-out`               | Controls           | Zoom out button           |
| `gc-controls__fit-view`               | Controls           | Fit view button           |
| `gc-minimap`                          | MiniMap            | Mini map container        |
| `gc-panel`                            | Panel              | Panel wrapper             |
| `gc-interaction-toolbar`              | InteractionToolbar | Toolbar wrapper           |
| `gc-interaction-toolbar__btn`         | InteractionToolbar | Toolbar button            |
| `gc-interaction-toolbar__btn--active` | InteractionToolbar | Active mode button        |

---

## Performance Guide

GridCanvas is designed for high performance with large layouts:

1. **Viewport Culling**: Set `onlyRenderVisibleItems` to only render items visible in the viewport. This scales to thousands of items.

2. **CSS Transforms**: Items are positioned using `transform: translate()` instead of `top/left` to avoid layout recalculations during drag.

3. **Memoized Components**: `ItemWrapper` and all plugin components use `React.memo()` to prevent unnecessary re-renders.

4. **Selective Subscriptions**: The Zustand store uses granular selectors so components only re-render when their specific data changes.

5. **Ref-based Drag State**: During drag/resize, pixel positions are tracked in refs (not state) to minimize React re-renders.

6. **Map Lookups**: Internal item data uses `Map<string, InternalItem>` for O(1) lookups instead of array scans.

## Architecture

```
@grid-canvas/core (framework-agnostic)
├── grid/          # Collision, compaction, layout math
├── canvas/        # Pan/zoom (d3-zoom), coordinate transforms
├── drag/          # Pointer-event drag handler
├── resize/        # Pointer-event resize handler
└── utils/         # DOM, math, store helpers

@grid-canvas/react (React bindings)
├── store/         # Zustand store (state + actions)
├── components/    # GridCanvas, ItemWrapper, Background, Controls, MiniMap
├── hooks/         # useGridCanvas, useViewport, useVisibleItems, useStore
└── contexts/      # GridCanvasContext (Zustand provider)
```

The core package has no React dependency and can be used with any framework. The React package provides the component layer with Zustand-powered state management.

## Running Examples

```bash
# Clone the repo
git clone https://github.com/grid-canvas/grid-canvas.git
cd grid-canvas

# Install dependencies
pnpm install

# Build packages
pnpm build

# Start the examples dev server
pnpm dev
```

## Contributing

Contributions are welcome! Please read through the architecture section to understand the codebase structure before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT
