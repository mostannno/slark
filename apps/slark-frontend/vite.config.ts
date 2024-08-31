import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "Components": path.resolve(__dirname, "src/Components"),
      "Widgets": path.resolve(__dirname, "src/Widgets"),
      "utils": path.resolve(__dirname, "src/utils"),
      "assets": path.resolve(__dirname, "src/assets"),
      "model": path.resolve(__dirname, "src/model"),
      "store": path.resolve(__dirname, "src/store"),
      "services": path.resolve(__dirname, "src/services"),
    }
  }
})
