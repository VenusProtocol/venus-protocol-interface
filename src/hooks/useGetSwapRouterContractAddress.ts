import config from 'config';
import { getSwapRouterContractAddress } from 'packages/contracts';
import { useMemo } from 'react';

export interface UseGetSwapRouterContractAddressInput {
  comptrollerAddress: string;
}

function useGetSwapRouterContractAddress({
  comptrollerAddress,
}: UseGetSwapRouterContractAddressInput) {
  // TODO: get from auth context. Right now the config defines the chain ID and so the dApp only
  // needs to support one chain, but since our goal is to become multichain then the chain ID needs
  // to be considered dynamic.
  const { chainId } = config;

  return useMemo(
    () =>
      chainId !== undefined
        ? getSwapRouterContractAddress({
            comptrollerAddress,
            chainId,
          })
        : undefined,
    [chainId],
  );
}

export default useGetSwapRouterContractAddress;
