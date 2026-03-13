import { useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { GridCanvasContext } from '../contexts/GridCanvasContext';
import type { GridCanvasState } from '../types';

export function useStore<T>(selector: (state: GridCanvasState) => T): T {
  const store = useContext(GridCanvasContext);
  if (!store) {
    throw new Error('useStore must be used within a <GridCanvas> or <GridCanvasProvider>');
  }
  return useZustandStore(store, selector);
}
