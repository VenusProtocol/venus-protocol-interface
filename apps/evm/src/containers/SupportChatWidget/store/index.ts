import { create } from 'zustand';

import type { StoreState } from '../types';

// Chat state lives outside the component tree so an unmount/remount of the
// widget (e.g. while a lazy route chunk loads) never wipes the visible
// conversation.
export const useStore = create<StoreState>()(set => ({
  isOpen: false,
  messages: [],
  isBusy: false,
  isSessionAlive: false,
  hasGreeted: false,
  nextMessageId: 0,
  setIsOpen: isOpen => set({ isOpen }),
  appendMessage: message =>
    set(state => ({
      nextMessageId: state.nextMessageId + 1,
      messages: [...state.messages, { ...message, id: state.nextMessageId + 1 }],
    })),
  setIsBusy: isBusy => set({ isBusy }),
  setIsSessionAlive: isSessionAlive => set({ isSessionAlive }),
  setHasGreeted: hasGreeted => set({ hasGreeted }),
}));
