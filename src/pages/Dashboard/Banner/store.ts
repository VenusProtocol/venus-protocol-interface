import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createStoreSelectors } from 'utilities';

interface State {
  shouldShowBanner: boolean;
  hideBanner: () => void;
}

const useStore = create<State>()(
  persist(
    set => ({
      shouldShowBanner: true,
      hideBanner: () => set({ shouldShowBanner: false }),
    }),
    {
      name: 'venus-dashboard-banner',
    },
  ),
);

export const store = createStoreSelectors(useStore);
