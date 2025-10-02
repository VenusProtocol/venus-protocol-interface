import url from '@rollup/plugin-url';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  plugins: [
    url({
      limit: 0,
      fileName: '[dirname][name][extname]',
    }),
  ],
});
