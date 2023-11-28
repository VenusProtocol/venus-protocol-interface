import { useMemo } from 'react';
import { usePublicClient } from 'wagmi';

import { ChainId } from 'types';

import { getProvider } from './getProvider';

export interface UseProviderInput {
  chainId?: ChainId;
}

export const useProvider = (input?: UseProviderInput) => {
  const publicClient = usePublicClient({ chainId: input?.chainId });
  const provider = useMemo(() => getProvider({ publicClient }), [publicClient]);

  return { provider };
};
