import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';
import { getSwapRouterContractAddress } from 'packages/contractsNew/utilities/getSwapRouterContractAddress';

export interface UseGetSwapRouterContractAddressInput {
  comptrollerContractAddress: string;
}

export const useGetSwapRouterContractAddress = ({
  comptrollerContractAddress,
}: UseGetSwapRouterContractAddressInput) => {
  const { chainId } = useAuth();

  return useMemo(
    () =>
      getSwapRouterContractAddress({
        chainId,
        comptrollerContractAddress,
      }),
    [chainId, comptrollerContractAddress],
  );
};
