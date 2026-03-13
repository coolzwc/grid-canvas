import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 部署在 https://<user>.github.io/<repo>/，base 必须为 /<repo>/
// 本地开发无 BASE_PATH 时用 /，构建时由 CI 注入 BASE_PATH=/<repo>/
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
  },
});
