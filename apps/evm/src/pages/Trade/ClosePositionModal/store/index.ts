import { create } from 'zustand';

import { createStoreSelectors } from 'utilities/createStoreSelectors';

export interface State {
  isModalShown: boolean;
  showModal: () => void;
  hideModal: () => void;
}

const useStore = create<State>()(set => ({
  isModalShown: false,
  showModal: () =>
    set(state => ({
      ...state,
      isModalShown: true,
    })),
  hideModal: () =>
    set(state => ({
      ...state,
      isModalShown: false,
    })),
}));

export const store = createStoreSelectors(useStore);
