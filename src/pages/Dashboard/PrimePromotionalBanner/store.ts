import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      name: 'venus-prime-promotional-banner',
    },
  ),
);

export const store = createStoreSelectors(useStore);
