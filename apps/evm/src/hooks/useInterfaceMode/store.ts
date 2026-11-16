import { routes } from 'constants/routing';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type InterfaceMode = 'lite' | 'pro';

const MODE_AGNOSTIC_PATHNAMES = [
  '/',
  routes.dashboard.path,
  routes.skills.path,
  routes.termsOfUse.path,
  routes.fixedTermVaultTermsOfUse.path,
  routes.privacyPolicy.path,
];

export const isProOnlyPathname = (pathname: string) =>
  !MODE_AGNOSTIC_PATHNAMES.includes(pathname.replace(/\/$/, '') || '/');

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
    },
  ),
);
