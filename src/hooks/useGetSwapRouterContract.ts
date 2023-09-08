import { getSwapRouterContract } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetSwapRouterContractInput {
  comptrollerAddress: string;
  passSigner?: boolean;
}

function useGetSwapRouterContract({
  comptrollerAddress,
  passSigner = false,
}: UseGetSwapRouterContractInput) {
  const { signer, provider, chainId } = useAuth();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () =>
      signerOrProvider
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
