import { useMemo } from 'react';
import { ChainId } from 'types';
import { useWalletClient } from 'wagmi';

import { getSigner } from './getSigner';

export interface UseSignerInput {
  chainId?: ChainId;
}

export const useSigner = (input?: UseSignerInput) => {
  const { data: walletClient } = useWalletClient({ chainId: input?.chainId });
  const signer = useMemo(
    () => getSigner({ walletClient: walletClient || undefined }),
    [walletClient],
  );

  return { signer };
};
