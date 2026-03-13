import type { GridCanvasState } from '../types';
import {
  DEFAULT_COLS,
  DEFAULT_ROW_HEIGHT,
  DEFAULT_MARGIN,
  DEFAULT_CONTAINER_PADDING,
  DEFAULT_MAX_ROWS,
} from '@grid-canvas/core';

export type InitialStateOptions = {
  cols?: number;
  rowHeight?: number;
  margin?: [number, number];
  containerPadding?: [number, number];
  maxRows?: number;
};

export function getInitialState(
  options: InitialStateOptions = {}
): Omit<GridCanvasState, 'setItems' | 'updateLayout' | 'setTransform' | 'setDimensions' | 'setPanZoom' | 'setDomNode' | 'startDrag' | 'updateDrag' | 'endDrag' | 'startResize' | 'updateResize' | 'endResize' | 'selectItem' | 'clearSelection' | 'setInteractionMode' | 'panBy' | 'zoomTo' | 'fitView' | 'getPositionParams'> {
  return {
    items: [],
    itemLookup: new Map(),
    transform: [0, 0, 1],
    width: 0,
    height: 0,
    panZoom: null,
    domNode: null,
    interactionMode: 'select',
    activeDrag: null,
    activeResize: null,
    selectedIds: new Set(),
    cols: options.cols ?? DEFAULT_COLS,
    rowHeight: options.rowHeight ?? DEFAULT_ROW_HEIGHT,
    margin: options.margin ?? DEFAULT_MARGIN,
    containerPadding: options.containerPadding ?? DEFAULT_CONTAINER_PADDING,
    maxRows: options.maxRows ?? DEFAULT_MAX_ROWS,
    compactType: 'vertical',
    preventCollision: false,
    draggable: true,
    resizable: true,
  };
}
