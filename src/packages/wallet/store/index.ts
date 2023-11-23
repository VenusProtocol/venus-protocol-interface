import { ChainId } from 'types';
import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';

import { defaultChain } from '../chains';

interface State {
  isAuthModalOpen: boolean;
  chainId: ChainId;
  setChainId: (input: { chainId: ChainId }) => void;
  setIsAuthModalOpen: (input: { isAuthModalOpen: boolean }) => void;
}

const useStore = create<State>()(set => ({
  isAuthModalOpen: false,
  chainId: defaultChain.id,
  setChainId: ({ chainId }) => set({ chainId }),
  setIsAuthModalOpen: ({ isAuthModalOpen }) => set({ isAuthModalOpen }),
}));

export const store = createStoreSelectors(useStore);
