import { create } from 'zustand';

interface State {
  isScrollToTopVisible: boolean;
  setScrollToTopVisible: (isScrollToTopVisible: State['isScrollToTopVisible']) => void;
  isCloseToBottom: boolean;
  setIsCloseToBottom: (isCloseToBottom: State['isCloseToBottom']) => void;
}

export const useStore = create<State>()(set => ({
  isScrollToTopVisible: false,
  setScrollToTopVisible: (v: boolean) => set({ isScrollToTopVisible: v }),
  isCloseToBottom: false,
  setIsCloseToBottom: (v: boolean) => set({ isCloseToBottom: v }),
}));
