import { ChainId } from '@venusprotocol/chains';

export const useChainId = vi.fn(() => ({
  chainId: ChainId.BSC_TESTNET,
}));
