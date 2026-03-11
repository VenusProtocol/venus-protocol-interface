import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

import type { YieldPlusPosition } from './types';

export interface GetYieldPlusPositionsInput {
  accountAddress?: string;
}

export interface GetYieldPlusPositionsOutput {
  positions: YieldPlusPosition[];
}

const getYieldPlusPositions = async (
  _input: GetYieldPlusPositionsInput,
): Promise<GetYieldPlusPositionsOutput> => {
  // Mock: returns empty positions (wallet disconnected state shown in UI)
  return { positions: [] };
};

type UseGetYieldPlusPositionsQueryKey = [
  FunctionKey.GET_YIELD_PLUS_POSITIONS,
  { chainId: ChainId; accountAddress: string },
];

type Options = QueryObserverOptions<
  GetYieldPlusPositionsOutput,
  Error,
  GetYieldPlusPositionsOutput,
  GetYieldPlusPositionsOutput,
  UseGetYieldPlusPositionsQueryKey
>;

export const useGetYieldPlusPositions = (
  input: GetYieldPlusPositionsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_YIELD_PLUS_POSITIONS,
      { chainId, accountAddress: input.accountAddress ?? '' },
    ],
    queryFn: () => getYieldPlusPositions(input),
    ...options,
  });
};
