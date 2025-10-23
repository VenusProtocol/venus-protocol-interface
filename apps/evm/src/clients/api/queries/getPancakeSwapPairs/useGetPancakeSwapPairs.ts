import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetPancakeSwapPairsInput,
  type GetPancakeSwapPairsOutput,
  getPancakeSwapPairs,
} from '.';

import generateTokenCombinationIds from './generateTokenCombinationIds';

const REFETCH_INTERVAL_MS = 3000;

export type UseGetPancakeSwapPairsQueryKey = [
  FunctionKey.GET_PANCAKE_SWAP_PAIRS,
  { chainId: ChainId },
  ...string[],
];

type Options = QueryObserverOptions<
  GetPancakeSwapPairsOutput,
  Error,
  GetPancakeSwapPairsOutput,
  GetPancakeSwapPairsOutput,
  UseGetPancakeSwapPairsQueryKey
>;

export const useGetPancakeSwapPairs = (
  input: Omit<GetPancakeSwapPairsInput, 'publicClient'>,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  // Generate query key based on token combinations
  const tokenCombinationIds = generateTokenCombinationIds(input.tokenCombinations);

  return useQuery({
    queryKey: [FunctionKey.GET_PANCAKE_SWAP_PAIRS, { chainId }, ...tokenCombinationIds],
    queryFn: () => getPancakeSwapPairs({ ...input, publicClient }),
    // Refresh request on every new block
    refetchInterval: REFETCH_INTERVAL_MS,
    staleTime: 0,
    gcTime: 0,
    ...options,
  });
};
