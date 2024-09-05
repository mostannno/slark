import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 在 outDir 中生成 .vite/manifest.json
    manifest: true,
    rollupOptions: {
      // 覆盖默认的 .html 入口
      input: '/src/main.tsx'
    }
  },
  server: {
    origin: 'http://localhost:5173',
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "widgets": path.resolve(__dirname, "src/widgets"),
      "shared": path.resolve(__dirname, "src/shared"),
      "assets": path.resolve(__dirname, "src/assets"),
      "store": path.resolve(__dirname, "src/store"),
      "entities": path.resolve(__dirname, "src/entities"),
    }
  }
})
