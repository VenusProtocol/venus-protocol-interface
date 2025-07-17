import { create } from 'zustand';

import { createStoreSelectors } from 'utilities';

interface State {
  isScrollToTopVisible: boolean;
  setScrollToTopVisible: (isScrollToTopVisible: State['isScrollToTopVisible']) => void;
  isCloseToBottom: boolean;
  setIsCloseToBottom: (isCloseToBottom: State['isCloseToBottom']) => void;
}

const useStore = create<State>()(set => ({
  isScrollToTopVisible: false,
  setScrollToTopVisible: (v: boolean) => set({ isScrollToTopVisible: v }),
  isCloseToBottom: false,
  setIsCloseToBottom: (v: boolean) => set({ isCloseToBottom: v }),
}));

export const store = createStoreSelectors(useStore);
