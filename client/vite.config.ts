import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Load secrets asynchronously
async function loadConfig() {
  const port = 3000;

  return defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
      'process.env': {},
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setupTests.ts'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${port}`,
          changeOrigin: true,
          secure: false,
        },
      },
      historyApiFallback: true,
    },
  });
}

export default loadConfig();
