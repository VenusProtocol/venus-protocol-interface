import { getSwapRouterContract } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetSwapRouterContractInput {
  comptrollerAddress: string;
}

function useGetSwapRouterContract({ comptrollerAddress }: UseGetSwapRouterContractInput) {
  const { signer, provider, chainId } = useAuth();
  const signerOrProvider = signer || provider;

  return useMemo(
    () =>
      chainId !== undefined
        ? getSwapRouterContract({
            comptrollerAddress,
            chainId,
            signerOrProvider,
          })
        : undefined,
    [signerOrProvider, comptrollerAddress, chainId],
  );
}

export default useGetSwapRouterContract;
