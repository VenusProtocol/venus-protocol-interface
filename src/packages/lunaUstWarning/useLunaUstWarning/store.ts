import { create } from 'zustand';

import { createStoreSelectors } from 'utilities';

interface State {
  isModalOpen: boolean;
  setIsModalOpen: (input: { isModalOpen: boolean }) => void;
}

const useStore = create<State>()(set => ({
  isModalOpen: false,
  setIsModalOpen: ({ isModalOpen }) => set({ isModalOpen }),
}));

export const store = createStoreSelectors(useStore);
