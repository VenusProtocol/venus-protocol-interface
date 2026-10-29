import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getEntryPathname } from './getEntryPathname';

export type InterfaceMode = 'lite' | 'pro';

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
        if (state && getEntryPathname() !== '/') {
          state.setMode('pro');
        }
      },
    },
  ),
);
