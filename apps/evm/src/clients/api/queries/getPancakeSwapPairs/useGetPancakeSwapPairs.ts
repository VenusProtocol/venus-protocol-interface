import { type QueryObserverOptions, useQuery } from 'react-query';

import getPancakeSwapPairs, {
  type GetPancakeSwapPairsInput,
  type GetPancakeSwapPairsOutput,
} from 'clients/api/queries/getPancakeSwapPairs';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId, useProvider } from 'libs/wallet';
import type { ChainId } from 'types';

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
  options?: Options,
) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();
  const { blockTimeMs } = useGetChainMetadata();

  // Generate query key based on token combinations
  const tokenCombinationIds = generateTokenCombinationIds(input.tokenCombinations);

  return useQuery(
    [FunctionKey.GET_PANCAKE_SWAP_PAIRS, { chainId }, ...tokenCombinationIds],
    () => getPancakeSwapPairs({ ...input, provider }),
    {
      // Refresh request on every new block
      refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,
      staleTime: 0,
      cacheTime: 0,
      ...options,
    },
  );
};

export default useGetPancakeSwapPairs;
