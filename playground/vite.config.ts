import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Point at source rather than `dist` so edits to the library hot-reload
      // without a rebuild. Remove this alias to test the published artifact.
      '@special-ui/react': fileURLToPath(new URL('../packages/react/src', import.meta.url)),
    },
  },
});
