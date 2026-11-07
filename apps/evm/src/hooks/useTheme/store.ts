import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'venus-theme';

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
};

interface State {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useStore = create<State>()(
  persist(
    set => ({
      theme: 'dark',
      setTheme: theme => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      onRehydrateStorage: () => state => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    },
  ),
);
