import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getPancakeSwapPairs, {
  type GetPancakeSwapPairsInput,
  type GetPancakeSwapPairsOutput,
} from 'clients/api/queries/getPancakeSwapPairs';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId, useProvider } from 'libs/wallet';

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

const useGetPancakeSwapPairs = (
  input: Omit<GetPancakeSwapPairsInput, 'provider' | 'chainId'>,
  options?: Partial<Options>,
) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();
  const { blockTimeMs } = useGetChainMetadata();

  // Generate query key based on token combinations
  const tokenCombinationIds = generateTokenCombinationIds(input.tokenCombinations);

  return useQuery({
    queryKey: [FunctionKey.GET_PANCAKE_SWAP_PAIRS, { chainId }, ...tokenCombinationIds],
    queryFn: () => getPancakeSwapPairs({ ...input, provider }),

    // Refresh request on every new block
    refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,

    staleTime: 0,
    gcTime: 0,
    ...options,
  });
};

export default useGetPancakeSwapPairs;
