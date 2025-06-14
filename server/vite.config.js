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
        // Mark all node modules as external
        /^node:/,
        // Common Node.js built-ins
        'fs', 'path', 'http', 'https', 'crypto', 'os', 'util', 'events',
        // Your dependencies (will be installed in production)
        '@google-cloud/bigquery',
        '@google-cloud/container',
        '@google-cloud/monitoring', 
        '@google-cloud/pubsub',
        '@google-cloud/secret-manager',
        '@google/genai',
        '@kubernetes/client-node',
        '@pinecone-database/pinecone',
        '@slack/web-api',
        'axios',
        'chalk',
        'cors',
        'dotenv',
        'express',
        'google-auth-library',
        'js-yaml', 
        'redis',
        'socket.io'
      ],
      output: {
        dir: 'dist',
        format: 'es'
      }
    },
    emptyOutDir: true
  },
  esbuild: {
    target: 'node18'
  }
});

