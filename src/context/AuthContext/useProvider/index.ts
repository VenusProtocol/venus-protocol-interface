import { ChainId } from 'packages/contracts';
import { useMemo } from 'react';
import { usePublicClient } from 'wagmi';

import getProvider from './getProvider';

export interface UseProviderInput {
  chainId?: ChainId;
}

const useProvider = ({ chainId }: UseProviderInput) => {
  const publicClient = usePublicClient();

  return useMemo(() => getProvider({ publicClient }), [chainId, publicClient]);
};

export default useProvider;
