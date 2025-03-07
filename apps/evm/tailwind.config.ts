/** @type {import('tailwindcss').Config} */
import path from 'node:path';
import tailwindConfig from '@venusprotocol/ui/tailwind-config';
import tailwindCssAnimate from 'tailwindcss-animate';

export default {
  presets: [tailwindConfig],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    ...tailwindConfig.content.map(dir =>
      path.join(path.dirname(require.resolve('@venusprotocol/ui')), dir),
    ),
  ],
  plugins: [tailwindCssAnimate],
};
