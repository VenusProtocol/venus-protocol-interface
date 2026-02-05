import createDeepMerge from '@fastify/deepmerge';
import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface State {
  doNotShowAdCarousel: boolean;
  hideAdCarousel: () => void;
}

const deepMerge = createDeepMerge({ all: true });

const useStore = create<State>()(
  persist(
    set => ({
      doNotShowAdCarousel: false,
      hideAdCarousel: () =>
        set(state => ({
          ...state,
          doNotShowAdCarousel: true,
        })),
    }),
    {
      name: 'venus-ad-carousel-store',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
);

export const store = createStoreSelectors(useStore);
