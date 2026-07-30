import { useQueryClient } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import type { LiquidityHub } from 'types';
import { areAddressesEqual } from 'utilities';
import type { GetLiquidityHubsOutput } from '../../getLiquidityHubs';
import type { UseGetLiquidityHubsQueryKey } from '../../getLiquidityHubs/useGetLiquidityHubs';
import type { UseGetLiquidityHubQueryKey } from '../useGetLiquidityHub';

export const useGetCachedLiquidityHub = ({
  vhTokenAddress,
  accountAddress,
  chainId,
}: UseGetLiquidityHubQueryKey[1]) => {
  const queryClient = useQueryClient();
  const queryResults = queryClient.getQueriesData<GetLiquidityHubsOutput>({
    queryKey: [
      FunctionKey.GET_LIQUIDITY_HUBS,
      {
        accountAddress,
        chainId,
      },
    ] satisfies UseGetLiquidityHubsQueryKey,
  });

  let cachedLiquidityHub: LiquidityHub | undefined;

  queryResults.forEach(([_queryKey, data]) =>
    (data?.liquidityHubs || []).forEach(liquidityHub => {
      if (areAddressesEqual(liquidityHub.vhToken.address, vhTokenAddress)) {
        cachedLiquidityHub = liquidityHub;
      }
    }),
  );

  return cachedLiquidityHub;
};
