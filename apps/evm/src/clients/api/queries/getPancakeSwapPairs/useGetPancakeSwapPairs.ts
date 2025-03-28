import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import {
  type GetPancakeSwapPairsInput,
  type GetPancakeSwapPairsOutput,
  getPancakeSwapPairs,
} from '.';

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import generateTokenCombinationIds from './generateTokenCombinationIds';

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
  const { blockTimeMs } = useGetChainMetadata();

  // Generate query key based on token combinations
  const tokenCombinationIds = generateTokenCombinationIds(input.tokenCombinations);

  return useQuery({
    queryKey: [FunctionKey.GET_PANCAKE_SWAP_PAIRS, { chainId }, ...tokenCombinationIds],
    queryFn: () => getPancakeSwapPairs({ ...input, publicClient }),

    // Refresh request on every new block
    refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,

    staleTime: 0,
    gcTime: 0,
    ...options,
  });
};
