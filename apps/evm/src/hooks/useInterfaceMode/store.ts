import { routes } from 'constants/routing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getEntryPathname } from './getEntryPathname';

export type InterfaceMode = 'lite' | 'pro';

export const SHARED_PATHNAMES = ['/', routes.dashboard.path];

interface State {
  mode: InterfaceMode;
  setMode: (mode: InterfaceMode) => void;
}

export const useStore = create<State>()(
  persist(
    set => ({
      mode: 'lite',
      setMode: mode => set({ mode }),
    }),
    {
      name: 'venus-interface-mode',
      onRehydrateStorage: () => state => {
        if (state && !SHARED_PATHNAMES.includes(getEntryPathname())) {
          state.setMode('pro');
        }
      },
    },
  ),
);
