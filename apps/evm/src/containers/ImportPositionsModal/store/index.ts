import createDeepMerge from '@fastify/deepmerge';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createStoreSelectors } from 'utilities/createStoreSelectors';

import type { StoreState } from './types';

const deepMerge = createDeepMerge({ all: true });

const useStore = create<StoreState>()(
  persist(
    set => ({
      doNotShowAgainFor: [],
      hideModal: ({ accountAddress }) =>
        set(state => ({
          doNotShowAgainFor: [...state.doNotShowAgainFor, accountAddress],
        })),
    }),
    {
      name: 'venus-import-positions-modal',
      merge: (persisted, current) => deepMerge(current, persisted) as never,
    },
  ),
);

export const store = createStoreSelectors(useStore);
