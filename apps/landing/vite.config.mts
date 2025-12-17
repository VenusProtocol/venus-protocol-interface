import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), viteTsConfigPaths(), svgr(), tailwindcss()],
  resolve: {
    alias: {
      // Import raw source so dApp is in charge of compiling token and chain icons
      '@venusprotocol/chains': '/../../packages/chains/src',
    },
  },
  build: {
    sourcemap: true,
    outDir: 'build',
  },
});
