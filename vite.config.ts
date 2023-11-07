/// <reference types="vitest" />
import inject from '@rollup/plugin-inject';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  build: {
    outDir: 'build',
    rollupOptions: {
      plugins: [
        inject({ Buffer: ['buffer', 'Buffer'] }),
        visualizer({
          filename: 'bundleStats.html',
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
        'src/packages/contracts/generated',
      ],
    },
  },
}));
