import { useMemo } from 'react';
import { ChainId } from 'types';
import { usePublicClient } from 'wagmi';

import { getProvider } from './getProvider';

export interface UseProviderInput {
  chainId?: ChainId;
}

export const useProvider = (input?: UseProviderInput) => {
  const publicClient = usePublicClient({ chainId: input?.chainId });
  return useMemo(() => getProvider({ publicClient }), [publicClient]);
};
