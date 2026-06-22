import { create } from 'zustand';

import { createStoreSelectors } from 'utilities/createStoreSelectors';
import type { StoreState } from '../types';

const store = create<StoreState<any>>()(set => ({
  lastFailedGaslessTransaction: undefined,
  openModal: ({ lastFailedGaslessTransaction }) => set({ lastFailedGaslessTransaction }),
  closeModal: () => set({ lastFailedGaslessTransaction: undefined }),
}));

export const useStore = createStoreSelectors(store);
