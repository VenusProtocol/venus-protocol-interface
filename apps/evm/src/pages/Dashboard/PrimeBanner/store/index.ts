import createDeepMerge from '@fastify/deepmerge';
import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface State {
  doNotShowPrimePromotionalBanner: boolean;
  hidePrimePromotionalBanner: () => void;
}

const deepMerge = createDeepMerge({ all: true });

const useStore = create<State>()(
  persist(
    set => ({
      doNotShowPrimePromotionalBanner: false,
      hidePrimePromotionalBanner: () =>
        set(state => ({
          ...state,
          doNotShowPrimePromotionalBanner: true,
        })),
    }),
    {
      name: 'venus-prime-banner-store',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
);

export const store = createStoreSelectors(useStore);
