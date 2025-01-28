import { usePublicClient as useWagmiPublicClient } from 'wagmi';

import type { ChainId } from 'types';
import type { PublicClient } from 'viem';
import { useChainId } from '../useChainId';

export const usePublicClient = (input?: { chainId: ChainId }) => {
  const { chainId: currentChainId } = useChainId();

  const publicClient = useWagmiPublicClient({
    chainId: input?.chainId || currentChainId,
  }) as PublicClient;

  return { publicClient };
};
