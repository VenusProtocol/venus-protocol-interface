import url from '@rollup/plugin-url';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  dts: true,
  plugins: [
    url({
      limit: Number.POSITIVE_INFINITY,
      fileName: '[dirname][name][extname]',
    }),
  ],
});
