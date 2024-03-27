/// <reference types="vitest" />
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

import { version as APP_VERSION } from './src/constants/version';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: './', // Force Vite to use relative imports in generated build
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
          }),
        ],
      },
    },
    build: {
      sourcemap: true,
      outDir: 'build',
      rollupOptions: {
        plugins: [
          inject({ Buffer: ['buffer', 'Buffer'] }),
          visualizer({
            filename: 'bundleStats.html',
          }),
          // Put the Sentry vite plugin after all other plugins
          sentryVitePlugin({
            authToken: env.SENTRY_AUTH_TOKEN,
            org: 'venus-protocol-km',
            project: 'dapp',
            release: {
              name: APP_VERSION,
            },
          }),
        ],
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.tsx',
      restoreMocks: true,
      coverage: {
        all: true,
        reporter: ['text', 'html', 'json-summary', 'json'],
        include: ['src/'],
        exclude: [
          '**/*.stories.tsx',
          '**/*/__mocks__/',
          '**/*/__testUtils__/',
          '**/*/types.ts',
          'src/setupTests.tsx',
          'src/stories/',
          'src/config/codegen.ts',
          'src/libs/contracts/generated',
        ],
      },
    },
  };
});
