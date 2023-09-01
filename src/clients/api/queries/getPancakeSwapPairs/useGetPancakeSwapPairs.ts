import { QueryObserverOptions, useQuery } from 'react-query';

import getPancakeSwapPairs, {
  GetPancakeSwapPairsInput,
  GetPancakeSwapPairsOutput,
} from 'clients/api/queries/getPancakeSwapPairs';
import { useMulticall3 } from 'clients/web3';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';

import generateTokenCombinationIds from './generateTokenCombinationIds';

type Options = QueryObserverOptions<
  GetPancakeSwapPairsOutput,
  Error,
  GetPancakeSwapPairsOutput,
  GetPancakeSwapPairsOutput,
  [FunctionKey.GET_PANCAKE_SWAP_PAIRS, ...string[]]
>;

const useGetPancakeSwapPairs = (
  input: Omit<GetPancakeSwapPairsInput, 'multicall3'>,
  options?: Options,
) => {
  const multicall3 = useMulticall3();

  // Generate query key based on token combinations
  const tokenCombinationIds = generateTokenCombinationIds(input.tokenCombinations);

  return useQuery(
    [FunctionKey.GET_PANCAKE_SWAP_PAIRS, ...tokenCombinationIds],
    () => getPancakeSwapPairs({ multicall3, ...input }),
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
