import { useMemo } from 'react';
import { ChainId } from 'types';
import { useWalletClient } from 'wagmi';

import getSigner from './getSigner';

export interface UseSignerInput {
  chainId?: ChainId;
}

const useSigner = (input?: UseSignerInput) => {
  const { data: walletClient } = useWalletClient({ chainId: input?.chainId });
  return useMemo(() => getSigner({ walletClient: walletClient || undefined }), [walletClient]);
};

export default useSigner;
