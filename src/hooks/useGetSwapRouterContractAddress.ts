import { getSwapRouterContractAddress } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetSwapRouterContractAddressInput {
  comptrollerAddress: string;
}

// TODO: move to contracts package
function useGetSwapRouterContractAddress({
  comptrollerAddress,
}: UseGetSwapRouterContractAddressInput) {
  const { chainId } = useAuth();

  return useMemo(
    () =>
      getSwapRouterContractAddress({
        comptrollerAddress,
        chainId,
      }),
    [chainId],
  );
}

export default useGetSwapRouterContractAddress;
