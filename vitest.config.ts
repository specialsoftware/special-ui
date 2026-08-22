import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@/components/ui',
        replacement: fileURLToPath(new URL('./registry/special/ui', import.meta.url)),
      },
      {
        find: '@/lib/utils',
        replacement: fileURLToPath(new URL('./registry/special/lib/utils.ts', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['registry/*/**/*.test.{ts,tsx}'],
  },
});
