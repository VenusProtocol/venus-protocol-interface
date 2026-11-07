import type { Theme } from '../store';

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
};
