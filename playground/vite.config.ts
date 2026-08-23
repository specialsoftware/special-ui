import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: '@/components/ui',
        replacement: fileURLToPath(new URL('../registry/special/ui', import.meta.url)),
      },
      {
        find: '@/blocks',
        replacement: fileURLToPath(new URL('../registry/special/blocks', import.meta.url)),
      },
      {
        find: '@/lib/utils',
        replacement: fileURLToPath(new URL('../registry/special/lib/utils.ts', import.meta.url)),
      },
    ],
  },
});
