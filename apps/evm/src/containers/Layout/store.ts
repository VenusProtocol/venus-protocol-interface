import { create } from 'zustand';

import { createStoreSelectors } from 'utilities';

interface State {
  isScrollToTopVisible: boolean;
  setScrollToTopVisible: (isScrollToTopVisible: State['isScrollToTopVisible']) => void;
}

const useStore = create<State>()(set => ({
  isScrollToTopVisible: false,
  setScrollToTopVisible: (v: boolean) => set({ isScrollToTopVisible: v }),
}));

export const store = createStoreSelectors(useStore);
