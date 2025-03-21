/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
import { theme } from './src/theme';

export default {
  content: ['**/*.{js,ts,jsx,tsx}'],
  theme,
  plugins: [
    // With this plugin enabled, applying the "berachain" class to any element allows to use
    // the "berachain" mode. e.g.: berachain:bg-red
    plugin(({ addVariant }) => addVariant('berachain', '.berachain &')),
  ],
};
