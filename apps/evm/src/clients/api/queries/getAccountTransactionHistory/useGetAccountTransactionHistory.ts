import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetAccountTransactionHistoryInput,
  type GetAccountTransactionHistoryOutput,
  getAccountTransactionHistory,
} from '.';
import { useGetLiquidityHubs } from '../getLiquidityHubs/useGetLiquidityHubs';
import { useGetSpokePools } from '../getSpokePools/useGetSpokePools';
import { useGetPools } from '../useGetPools';

type TrimmedGetAccountTransactionHistoryInput = Omit<
  GetAccountTransactionHistoryInput,
  'chainId' | 'getPoolsData' | 'liquidityHubs' | 'pools' | 'spokePools' | 'liquidityHubs'
>;

type Options = QueryObserverOptions<
  GetAccountTransactionHistoryOutput,
  Error,
  GetAccountTransactionHistoryOutput,
  GetAccountTransactionHistoryOutput,
  [
    FunctionKey.GET_ACCOUNT_TRANSACTION_HISTORY,
    TrimmedGetAccountTransactionHistoryInput & {
      chainId: ChainId;
      poolAddresses: Address[];
      spokePoolAddresses: Address[];
      liquidityHubAddresses: Address[];
    },
  ]
>;

export const useGetAccountTransactionHistory = (
  params: TrimmedGetAccountTransactionHistoryInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { data: getPoolsData } = useGetPools({ includeIsolatedPools: true });
  const { data: getSpokePoolsData } = useGetSpokePools();
  const pools = getPoolsData?.pools ?? [];
  const spokePools = getSpokePoolsData?.spokePools ?? [];

  const { data: getLiquidityHubsData } = useGetLiquidityHubs();
  const liquidityHubs = getLiquidityHubsData?.liquidityHubs ?? [];

  // Sort addresses alphabetically to prevent unnecessary re-renders
  const sortedPoolComptrollerAddresses = [...pools].map(pool => pool.comptrollerAddress).sort();
  const sortedSpokePoolAddresses = spokePools.map(spokePool => spokePool.comptrollerAddress).sort();
  const sortedLiquidityHubAddresses = [...liquidityHubs]
    .map(liquidityHub => liquidityHub.vhToken.address)
    .sort();

  const extendedParams = {
    ...params,
    pools,
    spokePools,
    liquidityHubs,
    chainId,
  };

  return useQuery({
    queryKey: [
      FunctionKey.GET_ACCOUNT_TRANSACTION_HISTORY,
      {
        ...params,
        chainId,
        poolAddresses: sortedPoolComptrollerAddresses,
        spokePoolAddresses: sortedSpokePoolAddresses,
        liquidityHubAddresses: sortedLiquidityHubAddresses,
      },
    ],
    queryFn: () => getAccountTransactionHistory(extendedParams),
    ...options,
  });
};
