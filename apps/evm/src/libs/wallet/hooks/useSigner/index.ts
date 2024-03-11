import { useMemo } from 'react';
import { useWalletClient } from 'wagmi';

import type { ChainId } from 'types';

import { useChainId } from '../useChainId';
import { getSigner } from './getSigner';

export interface UseSignerInput {
  chainId?: ChainId;
}

export const useSigner = (input?: UseSignerInput) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId || currentChainId;
  const { data: walletClient } = useWalletClient({ chainId });

  const signer = useMemo(
    () => getSigner({ walletClient: walletClient || undefined }),
    [walletClient],
  );

  return { signer };
};
