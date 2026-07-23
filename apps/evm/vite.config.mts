import babel from '@rolldown/plugin-babel';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsConfigPaths from 'vite-tsconfig-paths';

import { version as APP_VERSION } from './src/constants/version';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isTest = mode === 'test';

  const reactCompiler = isTest
    ? undefined
    : reactCompilerPreset({
        compilationMode: 'infer',
        panicThreshold: 'none',
      });

  if (reactCompiler) {
    reactCompiler.rolldown.filter ??= {};
    reactCompiler.rolldown.filter.id = {
      include: ['**/apps/evm/src/**'],
      exclude: ['**/node_modules/**', '**/packages/**'],
    };
  }

  return {
    base: './',
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
      ...(reactCompiler
        ? [
            babel({
              presets: [reactCompiler],
            }),
          ]
        : []),
      viteTsConfigPaths(),
      svgrPlugin(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Import raw source so dApp is in charge of compiling token and chain icons
        '@venusprotocol/chains': '/../../packages/chains/src',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
    build: {
      sourcemap: true,
      outDir: 'build',
      rollupOptions: {
        plugins: [
          visualizer({
            filename: 'bundleStats.html',
          }),
          // Put the Sentry vite plugin after all other plugins
          sentryVitePlugin({
            authToken: env.SENTRY_AUTH_TOKEN,
            applicationKey: 'venus-evm',
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
      passWithNoTests: true,
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.tsx',
      restoreMocks: true,
      coverage: {
        all: true,
        reporter: ['text', 'html', 'json-summary', 'json'],
        include: ['src/'],
        exclude: [
          '**/*/generated/',
          '**/*/types.ts',
          'src/stories/',
          '**/*.stories.tsx',
          '**/*/__mocks__/',
          '**/*/__testUtils__/',
          'src/setupTests.tsx',
        ],
      },
    },
  };
});
