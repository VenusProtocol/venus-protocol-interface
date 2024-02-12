/** @type {import('tailwindcss').Config} */
import { theme } from './src/theme';

module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  mode: 'jit',
  theme,
};
