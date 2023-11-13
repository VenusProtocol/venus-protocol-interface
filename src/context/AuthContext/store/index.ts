import { ChainId } from 'types';
import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';

import { defaultChain } from 'clients/web3';

interface State {
  chainId: ChainId;
  setChainId: (input: { chainId: ChainId }) => void;
}

const useStore = create<State>()(set => ({
  chainId: defaultChain.id,
  setChainId: ({ chainId }) => set({ chainId }),
}));

export const store = createStoreSelectors(useStore);
