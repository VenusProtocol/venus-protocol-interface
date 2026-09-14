import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetTokens } from 'libs/tokens';
import { useChainId } from 'libs/wallet';

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

  return useQuery({
    queryKey: [FunctionKey.GET_LIQUIDITY_HUBS, { chainId, ...input }],
    queryFn: () => getLiquidityHubs({ chainId, tokens, ...input }),
    refetchInterval,
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && isLiquidityHubFeatureEnabled,
  });
};
