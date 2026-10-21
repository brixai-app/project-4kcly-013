import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Vite configuration for Jootiya
// - React + TypeScript SPA
// - Dev server on port 5173 with host: true for broader accessibility
// - Path alias '@' -> './src' for clean imports

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    sourcemap: true,
  },
});