import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./tests/e2e/setup.ts'],
    include: ['tests/e2e/**/*.test.ts'],
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@ru-ready/shared': path.resolve(__dirname, './packages/shared/src/types/index.ts'),
      'react': path.resolve(__dirname, './client/node_modules/react'),
      'react-dom': path.resolve(__dirname, './client/node_modules/react-dom'),
      'clsx': path.resolve(__dirname, './client/node_modules/clsx'),
      'lucide-react': path.resolve(__dirname, './client/node_modules/lucide-react'),
      'framer-motion': path.resolve(__dirname, './client/node_modules/framer-motion'),
      'react-router-dom': path.resolve(__dirname, './client/node_modules/react-router-dom'),
      '@tanstack/react-query': path.resolve(__dirname, './client/node_modules/@tanstack/react-query'),
    },
  },
});
