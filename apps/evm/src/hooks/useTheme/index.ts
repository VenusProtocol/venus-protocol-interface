import { useStore } from './store';

export type { Theme, ThemePreference } from './store';

export const useTheme = () => {
  const preference = useStore(state => state.preference);
  const theme = useStore(state => state.theme);
  const setTheme = useStore(state => state.setPreference);

  return { preference, theme, isLight: theme === 'light', setTheme };
};
