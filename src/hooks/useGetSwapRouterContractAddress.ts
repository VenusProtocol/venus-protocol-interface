import { getSwapRouterContractAddress } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetSwapRouterContractAddressInput {
  comptrollerAddress: string;
}

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
