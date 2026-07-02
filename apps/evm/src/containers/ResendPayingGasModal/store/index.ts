import { create } from 'zustand';

import type { StoreState } from '../types';

export const useStore = create<StoreState<any>>()(set => ({
  lastFailedGaslessTransaction: undefined,
  openModal: ({ lastFailedGaslessTransaction }) => set({ lastFailedGaslessTransaction }),
  closeModal: () => set({ lastFailedGaslessTransaction: undefined }),
}));
