/** @type {import('tailwindcss').Config} */
import { theme } from './theme';

export default {
  content: ['**/*.{js,ts,jsx,tsx}'],
  mode: 'jit',
  theme,
};
