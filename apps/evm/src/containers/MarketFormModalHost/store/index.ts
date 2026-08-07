import { create } from 'zustand';

import type { StoreState } from '../types';

export const useStore = create<StoreState>()(set => ({
  request: undefined,
  openModal: request => set({ request }),
  closeModal: () => set({ request: undefined }),
}));
