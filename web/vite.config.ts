import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// The API runs on http://localhost:5065 (see src/CtaTraining.Api launchSettings.json).
const apiTarget = process.env.API_URL ?? 'http://localhost:5065';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
      '/health': { target: apiTarget, changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rolldownOptions: {
      output: {
        // Vendor code changes rarely; separate chunks stay cached across app releases.
        codeSplitting: {
          groups: [
            { name: 'msal', test: /node_modules[\\/]@azure[\\/]/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/ },
            { name: 'vendor', test: /node_modules[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
