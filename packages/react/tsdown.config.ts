import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/button/index.ts',
    'src/switch/index.ts',
    'src/dialog/index.ts',
    'src/styles/index.ts',
    'src/provider/index.ts',
  ],
  format: ['esm'],
  dts: true,
  clean: true,
  // Every component file carries a `'use client'` banner. Rolldown hoists directives
  // out of chunks by default, which would silently turn the whole bundle into a
  // client bundle (or drop the directive). Keeping modules unbundled preserves the
  // per-file boundary, which is what an RSC consumer needs.
  unbundle: true,
  external: ['react', 'react-dom', /^@base-ui\/react/],
  // The package is `"type": "module"`, so plain `.js` is already ESM. Keeping
  // the conventional extensions makes the `exports` map in package.json
  // readable, and keeps editor "go to definition" landing on `.d.ts`.
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  outputOptions: {
    preserveModules: true,
  },
});
