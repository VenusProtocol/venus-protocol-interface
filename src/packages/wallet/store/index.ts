import { create } from 'zustand';

import { createStoreSelectors } from 'utilities';

interface State {
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (input: { isAuthModalOpen: boolean }) => void;
}

const useStore = create<State>()(set => ({
  isAuthModalOpen: false,
  setIsAuthModalOpen: ({ isAuthModalOpen }) => set({ isAuthModalOpen }),
}));

export const store = createStoreSelectors(useStore);
