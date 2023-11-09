import { ChainId } from 'types';
import { createStoreSelectors } from 'utilities';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { chains } from 'clients/web3';

interface State {
  chainId: ChainId;
  setChainId: (input: { chainId: ChainId }) => void;
}

const defaultChainId = chains[0].id;

const useStore = create<State>()(
  persist(
    set => ({
      chainId: defaultChainId,
      setChainId: ({ chainId }) => set({ chainId }),
    }),
    {
      name: 'venus-chain-id',
    },
  ),
);

export const store = createStoreSelectors(useStore);
