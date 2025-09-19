/** @type {import('tailwindcss').Config} */
import path from 'node:path';
import tailwindConfig from '@venusprotocol/ui/tailwind-config';

export default {
  presets: [tailwindConfig],
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '840px',
      },
    },
  },
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    ...tailwindConfig.content.map(dir =>
      path.join(path.dirname(require.resolve('@venusprotocol/ui')), dir),
    ),
  ],
};
