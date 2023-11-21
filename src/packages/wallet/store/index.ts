import { defaultChain } from 'packages/wallet';
import { ChainId } from 'types';
import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';

interface State {
  chainId: ChainId;
  setChainId: (input: { chainId: ChainId }) => void;
}

const useStore = create<State>()(set => ({
  chainId: defaultChain.id,
  setChainId: ({ chainId }) => set({ chainId }),
}));

export const store = createStoreSelectors(useStore);
