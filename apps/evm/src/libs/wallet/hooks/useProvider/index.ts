import { useMemo } from 'react';
import { useClient } from 'wagmi';

import type { ChainId } from '@venusprotocol/chains';

import { useChainId } from '../useChainId';
import { getProvider } from './getProvider';

export interface UseProviderInput {
  chainId?: ChainId;
}

export const useProvider = (input?: UseProviderInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId || currentChainId;
  const client = useClient({ chainId });

  const provider = useMemo(() => getProvider({ client }), [client]);

  return { provider };
};
