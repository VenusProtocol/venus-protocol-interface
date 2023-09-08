import { QueryObserverOptions, useQuery } from 'react-query';

import getPancakeSwapPairs, {
  GetPancakeSwapPairsInput,
  GetPancakeSwapPairsOutput,
} from 'clients/api/queries/getPancakeSwapPairs';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

import generateTokenCombinationIds from './generateTokenCombinationIds';

type Options = QueryObserverOptions<
  GetPancakeSwapPairsOutput,
  Error,
  GetPancakeSwapPairsOutput,
  GetPancakeSwapPairsOutput,
  [FunctionKey.GET_PANCAKE_SWAP_PAIRS, ...string[]]
>;

const useGetPancakeSwapPairs = (
  input: Omit<GetPancakeSwapPairsInput, 'provider' | 'chainId'>,
  options?: Options,
) => {
  const { provider } = useAuth();

  // Generate query key based on token combinations
  const tokenCombinationIds = generateTokenCombinationIds(input.tokenCombinations);

  return useQuery(
    [FunctionKey.GET_PANCAKE_SWAP_PAIRS, ...tokenCombinationIds],
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
