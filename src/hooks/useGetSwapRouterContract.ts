import config from 'config';
import { getSwapRouterContract } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetSwapRouterContractInput {
  comptrollerAddress: string;
}

function useGetSwapRouterContract({ comptrollerAddress }: UseGetSwapRouterContractInput) {
  const { signer, provider } = useAuth();
  const signerOrProvider = signer || provider;
  // TODO: get from auth context. Right now the config defines the chain ID and so the dApp only
  // needs to support one chain, but since our goal is to become multichain then the chain ID needs
  // to be considered dynamic.
  const { chainId } = config;

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
