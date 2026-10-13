import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://kannabuilds.vercel.app',
  output: 'static',
  devToolbar: { enabled: false },
  server: { host: '127.0.0.1', port: 3004 },
  vite: {
    cacheDir: process.env.VITE_CACHE_DIR || 'node_modules/.vite',
    build: { chunkSizeWarningLimit: 700 },
  },
});
