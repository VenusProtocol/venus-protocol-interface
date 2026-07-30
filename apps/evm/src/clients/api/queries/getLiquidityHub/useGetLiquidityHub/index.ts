import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetTokens } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import type { Address } from 'viem';
import { type GetLiquidityHubInput, type GetLiquidityHubOutput, getLiquidityHub } from '..';
import { useGetCachedLiquidityHub } from '../useGetCachedLiquidityHub';

export type UseGetLiquidityHubInput = {
  vhTokenAddress: Address;
  accountAddress?: Address;
};

export type UseGetLiquidityHubQueryKey = [
  FunctionKey.GET_LIQUIDITY_HUB,
  Omit<GetLiquidityHubInput, 'tokens'>,
];

type Options = QueryObserverOptions<
  GetLiquidityHubOutput,
  Error,
  GetLiquidityHubOutput,
  GetLiquidityHubOutput,
  UseGetLiquidityHubQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetLiquidityHub = (input: UseGetLiquidityHubInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const tokens = useGetTokens({ chainId });

  const queryInput: GetLiquidityHubInput = {
    chainId,
    tokens,
    ...input,
  };

  // Initialize proposal using cache if available
  const cachedLiquidityHub = useGetCachedLiquidityHub({
    chainId,
    ...input,
  });

  return useQuery({
    queryKey: [FunctionKey.GET_LIQUIDITY_HUB, { chainId, ...input }],
    queryFn: () => getLiquidityHub(queryInput),
    refetchInterval,
    initialData: cachedLiquidityHub && {
      liquidityHub: cachedLiquidityHub,
    },
    refetchOnMount: false,
    ...options,
    ...options,
  });
};
