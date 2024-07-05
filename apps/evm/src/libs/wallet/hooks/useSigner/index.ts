import { useMemo } from 'react';
import { type Config, useConnectorClient } from 'wagmi';

import type { ChainId } from 'types';

import { useChainId } from '../useChainId';
import { getSigner } from './getSigner';

export interface UseSignerInput {
  chainId?: ChainId;
}

export const useSigner = (input?: UseSignerInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId || currentChainId;
  const { data: walletClient } = useConnectorClient<Config>({ chainId });

  const signer = useMemo(
    () => (walletClient ? getSigner({ walletClient }) : undefined),
    [walletClient],
  );

  return { signer };
};
