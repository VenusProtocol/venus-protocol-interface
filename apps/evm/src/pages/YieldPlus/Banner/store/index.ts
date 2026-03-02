import createDeepMerge from '@fastify/deepmerge';
import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface State {
  doNotShowBanner: boolean;
  hideBanner: () => void;
}

const deepMerge = createDeepMerge({ all: true });

const useStore = create<State>()(
  persist(
    set => ({
      doNotShowBanner: false,
      hideBanner: () =>
        set(state => ({
          ...state,
          doNotShowBanner: true,
        })),
    }),
    {
      name: 'venus-yield-plus-banner-store',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
);

export const store = createStoreSelectors(useStore);
