import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import type { Address } from 'viem';
import {
  type GetLiquidityHubHistoryInput,
  type GetLiquidityHubHistoryOutput,
  type LiquidityHubHistoryPeriod,
  getLiquidityHubHistory,
} from '..';

export type UseGetLiquidityHubHistoryInput = Omit<GetLiquidityHubHistoryInput, 'chainId'>;

export type UseGetLiquidityHubHistoryQueryKey = [
  FunctionKey.GET_LIQUIDITY_HUB_HISTORY,
  {
    chainId: ChainId;
    vhTokenAddress: Address;
    period: LiquidityHubHistoryPeriod;
  },
];

type Options = QueryObserverOptions<
  GetLiquidityHubHistoryOutput,
  Error,
  GetLiquidityHubHistoryOutput,
  GetLiquidityHubHistoryOutput,
  UseGetLiquidityHubHistoryQueryKey
>;

export const useGetLiquidityHubHistory = (
  input: UseGetLiquidityHubHistoryInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_LIQUIDITY_HUB_HISTORY, { chainId, ...input }],
    queryFn: () => getLiquidityHubHistory({ chainId, ...input }),
    ...options,
  });
};
