import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), viteTsConfigPaths(), svgr()],
  build: {
    sourcemap: true,
    outDir: 'build',
  },
});
