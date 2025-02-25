import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure correct file paths
  build: {
    assetsDir: 'assets', // Fixes incorrect MIME types
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
  },
});



