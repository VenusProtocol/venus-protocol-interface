import { create } from 'zustand';

type Modal = 'mobileMenu' | 'accountModal';

interface State {
  isScrollToTopVisible: boolean;
  setScrollToTopVisible: (isScrollToTopVisible: State['isScrollToTopVisible']) => void;
  isCloseToBottom: boolean;
  setIsCloseToBottom: (isCloseToBottom: State['isCloseToBottom']) => void;
  setOpenModal: (modal: Modal | undefined) => void;
  openModal?: Modal;
}

export const useStore = create<State>()(set => ({
  isScrollToTopVisible: false,
  setScrollToTopVisible: (v: boolean) => set({ isScrollToTopVisible: v }),
  isCloseToBottom: false,
  setIsCloseToBottom: (v: boolean) => set({ isCloseToBottom: v }),
  openModal: undefined,
  setOpenModal: (modal: Modal | undefined) => set({ openModal: modal }),
}));
