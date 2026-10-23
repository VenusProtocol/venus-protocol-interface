import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

import {
  type GetSpokeMarketHistoryInput,
  type GetSpokeMarketHistoryOutput,
  getSpokeMarketHistory,
} from '..';
import type { LiquidityHubHistoryPeriod } from '../../getLiquidityHubHistory';

export type UseGetSpokeMarketHistoryInput = Omit<GetSpokeMarketHistoryInput, 'chainId'>;

export type UseGetSpokeMarketHistoryQueryKey = [
  FunctionKey.GET_SPOKE_MARKET_HISTORY,
  { chainId: ChainId; vTokenAddress: Address; period: LiquidityHubHistoryPeriod },
];

type Options = QueryObserverOptions<
  GetSpokeMarketHistoryOutput,
  Error,
  GetSpokeMarketHistoryOutput,
  GetSpokeMarketHistoryOutput,
  UseGetSpokeMarketHistoryQueryKey
>;

export const useGetSpokeMarketHistory = (
  input: UseGetSpokeMarketHistoryInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_SPOKE_MARKET_HISTORY, { chainId, ...input }],
    queryFn: () => getSpokeMarketHistory({ chainId, ...input }),
    ...options,
  });
};
