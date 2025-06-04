import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'server',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: [
        // Externalize Node.js built-ins
        'fs', 'path', 'url', 'http', 'https', 'crypto', 'stream', 'util', 
        'events', 'buffer', 'querystring', 'os', 'net', 'tls', 'child_process',
        // Externalize all dependencies to avoid bundling issues
        ...Object.keys(require('./package.json').dependencies || {}),
        ...Object.keys(require('./package.json').peerDependencies || {})
      ],
      output: {
        dir: 'dist',
        format: 'es'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: false,
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,ts}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});

