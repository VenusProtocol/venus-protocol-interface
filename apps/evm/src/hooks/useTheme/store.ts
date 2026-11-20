import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { applyTheme } from './applyTheme';

export type Theme = 'dark' | 'light';
export type ThemePreference = Theme | 'system';

export const THEME_STORAGE_KEY = 'venus-theme';
export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system';

const DARK_COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const THEME_PREFERENCES: ThemePreference[] = ['dark', 'light', 'system'];

const getSystemTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia?.(DARK_COLOR_SCHEME_QUERY).matches
    ? 'dark'
    : 'light';

export const resolveTheme = (preference: ThemePreference): Theme =>
  preference === 'system' ? getSystemTheme() : preference;

interface State {
  preference: ThemePreference;
  theme: Theme;
  setPreference: (preference: ThemePreference) => void;
  syncSystemTheme: () => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      preference: DEFAULT_THEME_PREFERENCE,
      theme: resolveTheme(DEFAULT_THEME_PREFERENCE),
      setPreference: preference => {
        const theme = resolveTheme(preference);
        applyTheme(theme);
        set({ preference, theme });
      },
      syncSystemTheme: () => {
        if (get().preference !== 'system') {
          return;
        }

        const theme = getSystemTheme();
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: state => ({ theme: state.preference }),
      merge: (persistedState, currentState) => {
        const savedPreference = (persistedState as { theme?: unknown } | undefined)?.theme;
        const preference = THEME_PREFERENCES.includes(savedPreference as ThemePreference)
          ? (savedPreference as ThemePreference)
          : DEFAULT_THEME_PREFERENCE;

        return { ...currentState, preference, theme: resolveTheme(preference) };
      },
      onRehydrateStorage: () => state => {
        applyTheme(state ? state.theme : resolveTheme(DEFAULT_THEME_PREFERENCE));
      },
    },
  ),
);

if (typeof window !== 'undefined' && window.matchMedia) {
  window
    .matchMedia(DARK_COLOR_SCHEME_QUERY)
    .addEventListener('change', () => useStore.getState().syncSystemTheme());
}
