import { createContext, useContext } from 'react';
import type { GridCanvasStore } from '../store/createStore';

export const GridCanvasContext = createContext<GridCanvasStore | null>(null);

export function useStoreApi(): GridCanvasStore {
  const store = useContext(GridCanvasContext);
  if (!store) {
    throw new Error(
      'useStoreApi must be used within a <GridCanvas> or <GridCanvasProvider>'
    );
  }
  return store;
}
