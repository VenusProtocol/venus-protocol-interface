import { create } from 'zustand';

export interface State {
  isModalShown: boolean;
  showModal: () => void;
  hideModal: () => void;
}

export const useStore = create<State>()(set => ({
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
