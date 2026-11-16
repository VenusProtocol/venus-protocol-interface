import { useStore } from './store';

export type { Theme } from './store';

export const useTheme = () => {
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setTheme);

  return { theme, isLight: theme === 'light', setTheme };
};
