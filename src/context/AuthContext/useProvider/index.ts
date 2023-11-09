import { useMemo } from 'react';
import { ChainId } from 'types';
import { usePublicClient } from 'wagmi';

import getProvider from './getProvider';

export interface UseProviderInput {
  chainId?: ChainId;
}

const useProvider = (input?: UseProviderInput) => {
  const publicClient = usePublicClient({ chainId: input?.chainId });
  return useMemo(() => getProvider({ publicClient }), [publicClient]);
};

export default useProvider;
