import createDeepMerge from '@fastify/deepmerge';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createStoreSelectors } from 'utilities';

export interface State {
  doNotShowBanner: boolean;
  hideBanner: () => void;
}

const deepMerge = createDeepMerge({ all: true });

const store = create<State>()(
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
      name: 'venus-trade-banner-store',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
);

export const useStore = createStoreSelectors(store);
