import { useMemo } from 'react';
import { usePublicClient } from 'wagmi';

import type { ChainId } from 'types';

import { useChainId } from '../useChainId';
import { getProvider } from './getProvider';

export interface UseProviderInput {
  chainId?: ChainId;
}

export const useProvider = (input?: UseProviderInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId || currentChainId;
  const publicClient = usePublicClient({ chainId });

  const provider = useMemo(() => getProvider({ publicClient }), [publicClient]);

  return { provider };
};
