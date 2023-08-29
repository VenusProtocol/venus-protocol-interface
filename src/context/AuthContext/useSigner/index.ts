import { ChainId } from 'packages/contracts';
import { useMemo } from 'react';
import { useWalletClient } from 'wagmi';

import getSigner from './getSigner';

export interface UseSignerInput {
  chainId?: ChainId;
}

const useSigner = ({ chainId }: UseSignerInput) => {
  const { data: walletClient } = useWalletClient();

  return useMemo(
    () => getSigner({ walletClient: walletClient || undefined }),
    [chainId, walletClient],
  );
};

export default useSigner;
