import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Address } from 'viem';

import { useGetPool } from 'clients/api/queries/useGetPool';
import FunctionKey from 'constants/functionKey';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetTokens } from 'libs/tokens';
import { useChainId } from 'libs/wallet';

import { appendCorePrimeDistributionsToLiquidityHub } from 'utilities/appendCorePrimeDistributionsToLiquidityHub';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import { type GetLiquidityHubsInput, type GetLiquidityHubsOutput, getLiquidityHubs } from '..';

export type UseGetLiquidityHubsQueryKey = [
  FunctionKey.GET_LIQUIDITY_HUBS,
  Omit<GetLiquidityHubsInput, 'tokens'>,
];

type Options = QueryObserverOptions<
  GetLiquidityHubsOutput,
  Error,
  GetLiquidityHubsOutput,
  GetLiquidityHubsOutput,
  UseGetLiquidityHubsQueryKey
>;

export interface UseGetLiquidityHubsInput {
  accountAddress?: Address;
}

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetLiquidityHubs = (
  input?: UseGetLiquidityHubsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const tokens = useGetTokens({ chainId });
  const isLiquidityHubFeatureEnabled = useIsFeatureEnabled({ name: 'liquidityHub' });
  const isAutoResupplyEnabled = useIsFeatureEnabled({ name: 'liquidityHubAutoResupply' });
  const { corePoolComptrollerContractAddress } = useChain();
  const isQueryEnabled =
    (options?.enabled === undefined || options?.enabled) && isLiquidityHubFeatureEnabled;

  const { data: getCorePoolData } = useGetPool(
    {
      poolComptrollerAddress: corePoolComptrollerContractAddress,
      accountAddress: input?.accountAddress,
    },
    {
      enabled: isAutoResupplyEnabled && isQueryEnabled,
    },
  );

  const query = useQuery({
    queryKey: [FunctionKey.GET_LIQUIDITY_HUBS, { chainId, ...input }],
    queryFn: () => getLiquidityHubs({ chainId, tokens, ...input }),
    refetchInterval,
    ...options,
    enabled: isQueryEnabled,
  });

  const corePool = isAutoResupplyEnabled ? getCorePoolData?.pool : undefined;

  const data = useMemo(
    () =>
      corePool && query.data
        ? {
            ...query.data,
            liquidityHubs: query.data.liquidityHubs.map(liquidityHub =>
              appendCorePrimeDistributionsToLiquidityHub({ liquidityHub, corePool }),
            ),
          }
        : query.data,
    [corePool, query.data],
  );

  return {
    ...query,
    data,
  };
};
