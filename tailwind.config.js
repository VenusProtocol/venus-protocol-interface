/** @type {import('tailwindcss').Config} */
import { theme } from './src/theme';

const { colors, ...extendedTheme } = theme;

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  mode: 'jit',
  theme: {
    extend: extendedTheme,
    colors,
  },
};
