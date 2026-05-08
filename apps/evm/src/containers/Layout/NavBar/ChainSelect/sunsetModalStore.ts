import { create } from 'zustand';

interface SunsetModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useSunsetModalStore = create<SunsetModalState>(set => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
