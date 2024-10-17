import { create } from 'zustand';

import type { BaseContract } from 'ethers';
import { createStoreSelectors } from 'utilities';
import type { StoreState } from '../types';

const useStore = create<StoreState<any, BaseContract, string>>()(set => ({
  lastFailedGaslessTransaction: undefined,
  openModal: ({ lastFailedGaslessTransaction }) => set({ lastFailedGaslessTransaction }),
  closeModal: () => set({ lastFailedGaslessTransaction: undefined }),
}));

export const store = createStoreSelectors(useStore);
