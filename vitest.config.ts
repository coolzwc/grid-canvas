import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/**/__tests__/**/*.test.ts', 'packages/**/__tests__/**/*.test.tsx'],
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@grid-canvas/core': path.resolve(__dirname, 'packages/core/src'),
      '@grid-canvas/react': path.resolve(__dirname, 'packages/react/src'),
    },
  },
});
