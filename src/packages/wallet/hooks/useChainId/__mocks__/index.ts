import { ChainId } from 'types';

export const useChainId = vi.fn(() => ({
  chainId: ChainId.BSC_TESTNET,
}));
