import { create } from 'zustand';

import { createStoreSelectors } from 'utilities/createStoreSelectors';
import type { StoreState } from '../types';

const useStore = create<StoreState<any>>()(set => ({
  lastFailedGaslessTransaction: undefined,
  openModal: ({ lastFailedGaslessTransaction }) => set({ lastFailedGaslessTransaction }),
  closeModal: () => set({ lastFailedGaslessTransaction: undefined }),
}));

export const store = createStoreSelectors(useStore);
