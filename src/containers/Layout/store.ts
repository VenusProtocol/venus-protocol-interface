import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';

interface State {
  isScrollToTopVisible: boolean;
  setScrollToTopVisible: (isScrollToTopVisible: State['isScrollToTopVisible']) => void;
}

const useStore = create<State>()(set => ({
  isScrollToTopVisible: false,
  setScrollToTopVisible: (v: boolean) => set({ isScrollToTopVisible: v }),
}));

export const store = createStoreSelectors(useStore);
