import { create } from 'zustand';

import { createStoreSelectors } from 'utilities';

interface State {
  isModalOpen: boolean;
  wasModalOpenedThisSession: boolean;
  setIsModalOpen: (input: { isModalOpen: boolean }) => void;
}

const useStore = create<State>()(set => ({
  isModalOpen: false,
  wasModalOpenedThisSession: false,
  setIsModalOpen: ({ isModalOpen }) => set({ isModalOpen, wasModalOpenedThisSession: true }),
}));

export const store = createStoreSelectors(useStore);
