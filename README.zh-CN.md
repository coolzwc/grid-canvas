# GridCanvas

[English](README.md) | **中文**

**[在线示例 →](https://coolzwc.github.io/grid-canvas/)**

高性能、可扩展的 React 网格布局库，支持无限画布、平移缩放、拖拽与调整大小。

**GridCanvas** 将 [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) 的网格吸附、压缩与碰撞检测，与 [xyflow](https://github.com/xyflow/xyflow) 的无限画布、平移缩放与视口变换融为一体。

## 特性

- **网格布局**：可配置列数、行高、边距与内边距
- **拖拽**：网格吸附、阈值检测与可自定义拖拽手柄
- **调整大小**：任意边或角调整，支持最小/最大约束
- **无限画布**：流畅平移与缩放（基于 d3-zoom）
- **垂直/水平压缩**或自由布局（无压缩）
- **视口裁剪**：仅渲染可见项（可扩展至 1000+ 项）
- **可组合插件**：Background、Controls、MiniMap、InteractionToolbar、Panel 等子组件
- **自定义项类型**：通过 `itemTypes` 配置
- **嵌套网格**：开箱即用
- **TypeScript 优先**，完整类型支持
- **与框架无关的核心**（`@grid-canvas/core`）可在无 React 环境下使用
- **零依赖拖拽/调整大小**（不依赖 react-draggable 或 react-resizable）
- **轻量**：React 包约 34KB（minified）

## 安装

```bash
# npm
npm install @grid-canvas/react

# pnpm
pnpm add @grid-canvas/react

# yarn
yarn add @grid-canvas/react
```

需要 React 18+。

## 快速开始

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

## API 参考

### `<GridCanvas>`

主容器组件。所有网格项与插件组件必须作为其子节点。

#### 布局相关 Props

| Prop               | Type                                 | Default      | 说明                                                                                                                                                                                                       |
| ------------------ | ------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `Layout` (即 `LayoutItem[]`)         | **必填**      | 布局项数组，定义每项在网格中的位置与尺寸。每项需有唯一 `i`。                                                                                                                                                |
| `onItemsChange`    | `(items: Layout) => void`            | `undefined`  | 布局变化时触发（拖拽、调整大小或压缩后）。接收更新后的完整布局数组。用于同步状态：`onItemsChange={setItems}`。                                                                                            |
| `cols`             | `number`                             | `12`         | 网格列数。项的 `x`、`w` 以此为网格单位。例如 `cols={12}` 时，`w: 6` 占容器一半宽度。                                                                                                                       |
| `rowHeight`        | `number`                             | `60`         | 单行高度（像素）。`h: 2` 表示高度为 `2 × 60 = 120px`（不含边距）。                                                                                                                                         |
| `margin`           | `[number, number]`                   | `[10, 10]`   | 项间距（像素）`[水平, 垂直]`。                                                                                                                                                                             |
| `containerPadding` | `[number, number]`                   | `[10, 10]`   | 网格容器内边距（像素）`[水平, 垂直]`。                                                                                                                                                                     |
| `maxRows`          | `number`                             | `Infinity`   | 网格最大行数。项不可放置或拖拽超出此限制。`Infinity` 表示不限制。                                                                                                                                           |
| `compactType`      | `'vertical' \| 'horizontal' \| null` | `'vertical'` | 压缩方向。`'vertical'` 向上填充空隙；`'horizontal'` 向左；`null` 关闭压缩，保持自由布局。                                                                                                                    |
| `preventCollision` | `boolean`                            | `false`      | 为 `true` 时项不可重叠，拖拽到其他项上会被阻止。仅在 `compactType` 为 `null` 时有效。                                                                                                                       |

#### 交互相关 Props

| Prop                      | Type                              | Default     | 说明                                                                                                                                                                                                                                                                           |
| ------------------------- | --------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `draggable`               | `boolean`                         | `true`      | 是否全局启用拖拽。`false` 时所有项不可拖拽。单项可通过 `isDraggable` 覆盖。                                                                                                                                           |
| `resizable`               | `boolean`                         | `true`      | 是否全局启用调整大小。单项可通过 `isResizable` 覆盖。                                                                                                                                        |
| `resizeHandles`           | `ResizeHandleAxis[]`              | `['se']`    | 显示的调整大小手柄：`'s'`(下)、`'w'`(左)、`'e'`(右)、`'n'`(上)、`'sw'`、`'nw'`、`'se'`、`'ne'`。                                                                                                                                 |
| `dragHandle`              | `string`                          | `undefined` | 每项内拖拽手柄的 CSS 选择器。设置后仅匹配元素可触发拖拽。例：`dragHandle=".my-handle"`。                                                                                                    |
| `dragCancel`              | `string`                          | `undefined` | 阻止拖拽开始的 CSS 选择器。                                                                                                                                                       |
| `dragThreshold`           | `number`                          | `3`         | 指针需移动的像素数才视为开始拖拽，避免误触。                                                                                                                                         |
| `defaultInteractionMode`  | `'select' \| 'hand'`              | `'select'`  | 初始交互模式。`'select'` 可拖拽/调整项；`'hand'` 可平移画布。可通过 InteractionToolbar 或 `useGridCanvas` 切换。                                                                                                      |
| `onInteractionModeChange` | `(mode: InteractionMode) => void` | `undefined` | 交互模式变化时触发，参数为 `'select'` 或 `'hand'`。                                                                                                                                                          |

#### 视口 Props

| Prop              | Type       | Default                   | 说明                                                                                                                                                                               |
| ----------------- | ---------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultViewport` | `Viewport` | `{ x: 0, y: 0, zoom: 1 }` | 初始视口。`x`、`y` 为平移（像素），`zoom` 为缩放（1=100%）。 |
| `minZoom`         | `number`   | `0.1`                     | 最小缩放。0.1 表示可缩小到 10%。                                                                                                                               |
| `maxZoom`         | `number`   | `4`                       | 最大缩放。4 表示可放大到 400%。                                                                                                                |
| `panning`         | `boolean`  | `false`                   | 是否启用画布平移。                                                                                                                                                                         |
| `zooming`         | `boolean`  | `false`                   | 是否启用画布缩放（滚轮或 pinch）。                                                                                                                                                    |

#### 虚拟化 Props

| Prop                     | Type      | Default | 说明                                                                                                                                                                                                                                                                            |
| ------------------------ | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onlyRenderVisibleItems` | `boolean` | `false` | 为 `true` 时仅渲染当前视口内的项，大幅提升大量项（1000+）时的性能。正在拖拽或调整大小的项始终会渲染。 |

#### 自定义渲染 Props

| Prop        | Type                                                | Default     | 说明                                                                                                                                                                                                                                           |
| ----------- | --------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `itemTypes` | `Record<string, ComponentType<ItemComponentProps>>` | `undefined` | 项类型到自定义组件的映射。当 `LayoutItem` 有 `type`（如 `type: 'chart'`）时，使用此映射中的组件渲染，接收 `{ item, children, isDragging, isResizing }`。 |

#### 事件回调 Props

| Prop               | Type                                              | Default     | 说明                                                                                                                                                         |
| ------------------ | ------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onDragStart`      | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | 开始拖拽时触发。                                                                                                                                                      |
| `onDrag`           | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | 拖拽过程中持续触发。                                                                                                                                                     |
| `onDragStop`       | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | 拖拽结束时触发，`item` 为最终位置。                                                                                                                                     |
| `onResizeStart`    | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | 开始调整大小时触发。                                                                                                                                                      |
| `onResize`         | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | 调整大小过程中持续触发。                                                                                                                                                  |
| `onResizeStop`     | `(item: LayoutItem, event: PointerEvent) => void` | `undefined` | 调整大小结束时触发。                                                                                                                                                          |
| `onViewportChange` | `(viewport: Viewport) => void`                    | `undefined` | 视口变化（平移或缩放）时触发，可用于持久化或同步外部 UI。                                                                                                                          |

#### 样式 Props

| Prop        | Type                  | Default     | 说明                                                                                                                                |
| ----------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `className` | `string`              | `undefined` | 根容器 CSS 类名。容器始终有 `gc-container`。                                   |
| `style`     | `React.CSSProperties` | `undefined` | 根容器内联样式，默认 `position: relative; width: 100%; height: 100%; overflow: hidden`。 |

---

### `LayoutItem`

定义单个网格项的位置、尺寸与行为。

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

| 属性        | Type                 | Default      | 说明                                                                                                                                                                                                                                 |
| --------------- | -------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `i`             | `string`             | **必填**     | 唯一标识，用作 React key 与内部查找。                                                                                                              |
| `x`             | `number`             | **必填**     | 水平位置（网格单位，从 0 起）。`cols=12` 时有效为 0～11。                                                                                             |
| `y`             | `number`             | **必填**     | 垂直位置。可用 `Infinity` 表示放在底部。                                                                                                                     |
| `w`             | `number`             | **必填**     | 宽度（网格单位），最小有效为 1。                                                                                                                       |
| `h`             | `number`             | **必填**     | 高度（网格单位），最小有效为 1。                                                                                                                       |
| `type`          | `string`             | `undefined`  | 用于从 `itemTypes` 查找自定义渲染组件。                                                                                                                             |
| `minW` / `maxW` | `number`             | `1` / `Infinity` | 最小/最大宽度（网格单位）。                                                                                                                                          |
| `minH` / `maxH` | `number`             | `1` / `Infinity` | 最小/最大高度（网格单位）。                                                                                                                                          |
| `isStatic`      | `boolean`            | `false`      | 为 `true` 时不可拖拽、调整大小或参与压缩，适合标题、页脚等固定块。                                                                                                                         |
| `isDraggable`   | `boolean`            | `undefined`  | 单项是否可拖拽，覆盖全局 `draggable`。                                                                                                                                  |
| `isResizable`   | `boolean`            | `undefined`  | 单项是否可调整大小，覆盖全局 `resizable`。                                                                                                                              |
| `resizeHandles` | `ResizeHandleAxis[]` | `undefined`  | 单项调整大小手柄，覆盖全局 `resizeHandles`。                                                                                                                           |

### `ResizeHandleAxis`

```typescript
type ResizeHandleAxis = "s" | "w" | "e" | "n" | "sw" | "nw" | "se" | "ne";
```

| 值  | 位置       | 说明           |
| ------ | ----------- | --------------- |
| `'s'`  | 下边中      | 拖拽底边        |
| `'n'`  | 上边中      | 拖拽顶边        |
| `'e'`  | 右边中      | 拖拽右边        |
| `'w'`  | 左边中      | 拖拽左边        |
| `'se'` | 右下角（默认） | 拖拽右下角      |
| `'sw'` | 左下角      | 拖拽左下角      |
| `'ne'` | 右上角      | 拖拽右上角      |
| `'nw'` | 左上角      | 拖拽左上角      |

### `Viewport`

画布平移/缩放状态。

```typescript
interface Viewport {
  x: number;   // 水平平移（像素，正为向右）
  y: number;   // 垂直平移（像素，正为向下）
  zoom: number; // 缩放（1=100%, 0.5=50%, 2=200%）
}
```

### `FitViewOptions`

`fitView()` 的选项。

```typescript
interface FitViewOptions {
  padding?: number;   // 内容外额外边距（默认 0.1，即视口 10%）
  minZoom?: number;
  maxZoom?: number;
  duration?: number;  // 动画时长（毫秒），0 为即时
}
```

### `ItemComponentProps`

通过 `itemTypes` 传入的自定义项组件的 props。

```typescript
interface ItemComponentProps {
  item: LayoutItem;
  children?: ReactNode;
  isDragging: boolean;
  isResizing: boolean;
}
```

### `Transform`

视口的内部表示元组。

```typescript
type Transform = [number, number, number]; // [translateX, translateY, scale]
```

---

### 插件组件

插件作为 `<GridCanvas>` 的直接子节点，以固定定位叠在视口外。

#### `<Background>`

在画布内绘制重复背景图案，随视口移动与缩放。

| Prop        | Type                          | Default                            | 说明                                                                                                                                                       |
| ----------- | ----------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`   | `'dots' \| 'grid' \| 'lines'` | `'dots'`                           | 图案类型。`'dots'` 圆点、`'grid'` 网格线、`'lines'` 仅水平线。 |
| `gap`       | `number`                      | `20`                               | 图案间距（像素，zoom=1 时），会随缩放调整。                  |
| `size`      | `number`                      | 点 1.5，线 1                       | 图案元素大小（点半径或线宽）。                                         |
| `color`     | `string`                      | `'rgba(0, 0, 0, 0.08)'`            | 图案颜色。                                      |
| `className` | `string`                      | `''`                               | 额外类名，组件始终带 `gc-background`。                                                                                              |

#### `<Controls>`

浮动工具栏：放大、缩小、适应视口。

| Prop          | Type                                                           | Default         | 说明                                                                                                                                                                              |
| ------------- | -------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `position`    | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-left'` | 控件所在角落。                                                                                                             |
| `showZoom`    | `boolean`                                                      | `true`          | 是否显示 +/- 按钮，每次约 ±0.2 缩放。                                                                                                  |
| `showFitView` | `boolean`                                                      | `true`          | 是否显示适应视口按钮。                                                                                                |
| `className`   | `string`                                                       | `''`            | 额外类名；按钮类名：`gc-controls__btn`、`gc-controls__zoom-in`、`gc-controls__zoom-out`、`gc-controls__fit-view`。 |

#### `<MiniMap>`

小地图：显示所有项与当前视口范围（项为蓝矩形，视口为红框）。

| Prop        | Type                                                           | Default          | 说明                                                                  |
| ----------- | -------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------- |
| `position`  | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | 小地图位置。 |
| `width`     | `number`                                                       | `180`            | 宽度（像素）。                                             |
| `height`    | `number`                                                       | `120`            | 高度（像素）。                                             |
| `className` | `string`                                                       | `''`             | 额外类名，组件带 `gc-minimap`。                                            |

#### `<InteractionToolbar>`

在 `'select'`（拖拽项）与 `'hand'`（平移画布）间切换。

| Prop        | Type                                                           | Default         | 说明                                                                                                                            |
| ----------- | -------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `position`  | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-left'` | 工具栏位置。                                                            |
| `show`      | `boolean`                                                      | `true`          | 是否渲染。`false` 时返回 `null`。                                                             |
| `className` | `string`                                                       | `''`            | 额外类名；激活按钮带 `gc-interaction-toolbar__btn--active`。 |

#### `<Panel>`

通用定位 overlay，可放自定义内容（如缩放指示、图例）。

| Prop        | Type                                                           | Default      | 说明                                                               |
| ----------- | -------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `position`  | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | **必填**     | 面板角落。 |
| `children`  | `ReactNode`                                                    | `undefined`  | 面板内容。                                       |
| `className` | `string`                                                       | `''`         | 额外类名，组件带 `gc-panel`。           |

---

### Hooks

所有 hook 必须在 `<GridCanvas>` 内使用（依赖 `GridCanvasContext`）。

#### `useGridCanvas()`

命令式 API，返回包含方法的对象（非响应式，调用时读取当前状态）。

```typescript
const api = useGridCanvas();
```

| 方法           | 签名                            | 说明                                                                            |
| ---------------- | ------------------------------------ | -------------------------------------------------------------------------------------- |
| `getItems`       | `() => Layout`                       | 当前布局数组。                                                      |
| `setItems`       | `(items: Layout) => void`            | 替换整个布局，触发压缩与重渲染。                         |
| `getViewport`    | `() => Viewport`                     | 当前视口 `{ x, y, zoom }`。                                         |
| `setViewport`    | `(viewport: Viewport) => void`       | 设置视口，可通过 pan-zoom 做动画。     |
| `fitView`        | `(options?: FitViewOptions) => void` | 缩放平移以适应所有项。 |
| `zoomIn` / `zoomOut` | `(step?: number) => void`         | 增减缩放，默认步长 0.2。                        |
| `panBy`          | `(dx: number, dy: number) => void`   | 按像素平移画布。                |
| `getSelectedIds` | `() => string[]`                     | 当前选中项 ID 数组。                                       |
| `clearSelection` | `() => void`                         | 清除选中。                                                                   |

#### `useViewport()`

响应式视口状态，视口变化时组件会重渲染。

```typescript
const { viewport, transform, panBy, zoomTo, fitView } = useViewport();
```

| 返回值      | Type                                                        | 说明                                                                                           |
| ----------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `viewport`  | `Viewport`                                                  | 当前 `{ x, y, zoom }`，响应式。             |
| `transform` | `Transform`                                                 | 原始变换元组 `[translateX, translateY, scale]`。 |
| `panBy`     | `(dx, dy) => void`                                          | 按像素平移。                                                                      |
| `zoomTo`    | `(zoom, center?) => void`                                   | 设置缩放，可选中心点。                                                                      |
| `fitView`   | `(options?) => void`                                        | 适应所有项。                                                                        |

#### `useVisibleItems(onlyVisible: boolean)`

返回当前视口内可见的项 ID 数组。

```typescript
const visibleIds: string[] = useVisibleItems(true);
```

| 参数     | Type      | 说明                                                                                                                                                        |
| ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onlyVisible` | `boolean` | `true` 仅返回与视口相交的项；`false` 返回全部。正在拖拽/调整大小的项始终包含。 |

#### `useStore(selector)`

通过 selector 访问 Zustand store，仅当选中值变化时重渲染（浅比较）。

```typescript
const items = useStore((s) => s.items);
const transform = useStore((s) => s.transform);
const cols = useStore((s) => s.cols);
const isDragging = useStore((s) => s.activeDrag !== null);
```

常用状态属性：`items`、`itemLookup`、`transform`、`width`、`height`、`interactionMode`、`activeDrag`、`activeResize`、`selectedIds`、`cols`、`rowHeight`、`margin`、`containerPadding`、`compactType`、`draggable`、`resizable`。Store 也提供 `setItems`、`updateLayout`、`setTransform`、`startDrag`、`updateDrag`、`endDrag`、`startResize`、`updateResize`、`endResize`、`selectItem`、`clearSelection`、`setInteractionMode`、`panBy`、`zoomTo`、`fitView` 等 action。

#### `useStoreApi()`

返回原始 Zustand store，用于非响应式访问（如在回调、effect 中）。

```typescript
const store = useStoreApi();
const currentItems = store.getState().items;
const unsub = store.subscribe((state, prevState) => { ... });
```

---

### Context

#### `GridCanvasContext`

提供 Zustand store 的 React 上下文，由 `<GridCanvas>` 自动注入。仅在完全自定义、且组件不在 `<GridCanvas>` 树下时需要手动使用。

```typescript
import { GridCanvasContext } from "@grid-canvas/react";
const store = useContext(GridCanvasContext);
```

---

## 示例

### 自由画布（无压缩）

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

### 带自定义组件的仪表盘

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

### 静态（锁定）项

```tsx
const items: Layout = [
  { i: "header", x: 0, y: 0, w: 12, h: 1, isStatic: true },
  { i: "content", x: 0, y: 1, w: 8, h: 4 },
  { i: "sidebar", x: 8, y: 1, w: 4, h: 4 },
  { i: "footer", x: 0, y: 5, w: 12, h: 1, isStatic: true },
];
```

### 事件处理

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

### 大数据集与虚拟化

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

### 嵌套网格

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

### 交互模式切换

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

## 核心包（无 UI）

非 React 场景可直接使用 `@grid-canvas/core`：

```bash
npm install @grid-canvas/core
```

### 网格引擎

布局计算、碰撞检测、压缩等。

| 函数                  | 说明                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| `calcGridColWidth`        | 根据容器宽度、列数、边距等计算单列像素宽度。 |
| `calcGridItemPosition`    | 网格坐标转像素位置 `{ left, top, width, height }`。             |
| `calcXY`                  | 像素坐标转网格坐标。                                             |
| `calcWH`                  | 像素尺寸转网格宽高。                                             |
| `collides`                | 判断两布局项是否重叠。                                                              |
| `getFirstCollision`       | 找到与给定项碰撞的第一个项。                            |
| `getAllCollisions`        | 找到所有与给定项碰撞的项。                                   |
| `moveElement`             | 移动项并处理碰撞与压缩。                                 |
| `getCompactor`            | 按压缩类型获取压缩器。                                 |
| `verticalCompactor` / `horizontalCompactor` / `noCompactor` | 内置压缩器。 |
| `cloneLayout` / `cloneLayoutItem` | 深拷贝布局/单项。 |
| `getLayoutItem`           | 按 ID 查找项。                                                                             |
| `bottom`                  | 布局中最底部的 Y 坐标。                                                                  |
| `validateLayout`          | 校验并规范化布局。                                                                      |
| `sortLayoutItemsByRowCol` / `sortLayoutItemsByColRow` | 排序比较器。 |

### 画布引擎

坐标变换、视口与 pan/zoom 计算。

| 函数               | 说明                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `viewportToTransform`  | `{ x, y, zoom }` → `[tx, ty, scale]`。                                                  |
| `transformToViewport`  | `[tx, ty, scale]` → `{ x, y, zoom }`。                                                  |
| `screenToCanvas`       | 屏幕坐标转画布坐标。         |
| `canvasToScreen`       | 画布坐标转屏幕坐标。         |
| `snapPosition`         | 坐标吸附到网格。                                   |
| `getVisibleRect`       | 根据容器尺寸与变换计算可见矩形。         |
| `getViewportForBounds` | 根据边界计算适应视口。                             |
| `rectsOverlap`         | 两矩形是否相交。                                  |
| `getBoundsOfRects`     | 多矩形包围盒。                                        |
| `createPanZoom`        | 在 DOM 元素上创建 pan/zoom 控制器（内部用 d3-zoom）。                   |

### 拖拽与调整大小

| 函数              | 说明                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| `createDragHandler`   | 创建带指针事件处理的拖拽逻辑。                               |
| `snapToGridPosition`  | 像素坐标吸附到网格。                               |
| `createResizeHandler` | 创建调整大小逻辑。                             |
| `getSizeConstraints`  | 根据项属性与列数得到尺寸约束。            |
| `constrainSize`       | 将宽高限制在约束内。                                   |

### 工具函数

| 函数              | 说明                                                           |
| --------------------- | --------------------------------------------------------------------- |
| `getRelativePosition` | 事件相对于容器的坐标。                   |
| `setTransformStyle`   | 设置元素 `transform: translate3d()`。                   |
| `setTopLeftStyle`     | 设置 `top/left/width/height`。                        |
| `clamp` / `lerp` / `distance` | 数值与几何工具。 |
| `adoptItems`          | 布局项转内部项（含像素位置）。                   |
| `getItemRects`        | 布局中所有项的像素矩形。                    |

### 常量

`DEFAULT_COLS`、`DEFAULT_ROW_HEIGHT`、`DEFAULT_MARGIN`、`DEFAULT_CONTAINER_PADDING`、`DEFAULT_MAX_ROWS`、`DEFAULT_MIN_ZOOM`、`DEFAULT_MAX_ZOOM`、`DEFAULT_DRAG_THRESHOLD`、`DEFAULT_RESIZE_HANDLES`、`INFINITE_EXTENT` 等。

---

## CSS 类名参考

组件使用 BEM 风格、`gc-` 前缀的类名便于自定义样式。

| 类名                                 | 组件           | 说明               |
| ------------------------------------- | ------------------ | ------------------------- |
| `gc-container`                        | GridCanvas         | 根容器    |
| `gc-background`                       | Background         | 背景 SVG    |
| `gc-controls` / `gc-controls__btn` 等 | Controls           | 控件与按钮 |
| `gc-minimap`                          | MiniMap            | 小地图容器        |
| `gc-panel`                            | Panel              | 面板        |
| `gc-interaction-toolbar` 等           | InteractionToolbar | 交互工具栏        |

---

## 性能说明

GridCanvas 针对大量项做了优化：

1. **视口裁剪**：开启 `onlyRenderVisibleItems` 只渲染可见项，可支撑数千项。
2. **CSS Transform**：项用 `transform` 定位，拖拽时减少布局计算。
3. **Memo**：`ItemWrapper` 与插件均使用 `React.memo()`。
4. **选择性订阅**：Zustand 细粒度 selector，仅数据变化时重渲染。
5. **Ref 记录拖拽**：拖拽/调整大小时用 ref 存像素位置，减少 re-render。
6. **Map 查找**：内部用 `Map<string, InternalItem>` 做 O(1) 查找。

## 架构

```
@grid-canvas/core（与框架无关）
├── grid/       # 碰撞、压缩、布局计算
├── canvas/     # Pan/zoom (d3-zoom)、坐标变换
├── drag/       # 指针拖拽
├── resize/     # 指针调整大小
└── utils/      # DOM、数学、store 辅助

@grid-canvas/react（React 绑定）
├── store/      # Zustand store（状态 + actions）
├── components/ # GridCanvas、ItemWrapper、Background、Controls、MiniMap 等
├── hooks/      # useGridCanvas、useViewport、useVisibleItems、useStore
└── contexts/   # GridCanvasContext
```

核心包无 React 依赖，可与任意框架配合；React 包在此基础上提供组件与 Zustand 状态管理。

## 运行示例

```bash
git clone https://github.com/grid-canvas/grid-canvas.git
cd grid-canvas
pnpm install
pnpm build
pnpm dev
```

## 参与贡献

欢迎贡献。提交 PR 前建议先阅读架构部分了解代码结构。

1. Fork 本仓库  
2. 创建分支（`git checkout -b feature/my-feature`）  
3. 提交更改  
4. 推送到分支  
5. 提交 Pull Request  

## 许可证

MIT
