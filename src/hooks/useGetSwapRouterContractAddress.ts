import { useAuth } from 'context/AuthContext';
import { getSwapRouterContractAddress } from 'packages/contracts';
import { useMemo } from 'react';

export interface UseGetSwapRouterContractAddressInput {
  comptrollerAddress: string;
}

function useGetSwapRouterContractAddress({
  comptrollerAddress,
}: UseGetSwapRouterContractAddressInput) {
  const { chainId } = useAuth();

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
