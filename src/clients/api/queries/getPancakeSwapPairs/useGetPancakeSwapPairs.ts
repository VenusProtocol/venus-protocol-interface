import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';

import getPancakeSwapPairs, {
  GetPancakeSwapPairsInput,
  GetPancakeSwapPairsOutput,
} from 'clients/api/queries/getPancakeSwapPairs';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

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
  const { provider, chainId } = useAuth();

  // Generate query key based on token combinations
  const tokenCombinationIds = generateTokenCombinationIds(input.tokenCombinations);

  return useQuery(
    [FunctionKey.GET_PANCAKE_SWAP_PAIRS, { chainId }, ...tokenCombinationIds],
    () => getPancakeSwapPairs({ ...input, provider }),
    {
      // Refresh request on every new block
      refetchInterval: BLOCK_TIME_MS,
      staleTime: 0,
      cacheTime: 0,
      ...options,
    },
  );
};

export default useGetPancakeSwapPairs;
