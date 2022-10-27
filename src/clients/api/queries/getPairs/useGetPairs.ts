import { QueryObserverOptions, useQuery } from 'react-query';

import getPairs, { GetPairsInput, GetPairsOutput } from 'clients/api/queries/getPairs';
import { useMulticall } from 'clients/web3';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';

import generateTokenCombinationId from './generateTokenCombinationId';

type Options = QueryObserverOptions<
  GetPairsOutput,
  Error,
  GetPairsOutput,
  GetPairsOutput,
  [FunctionKey.GET_PAIR_RESERVES, ...string[]]
>;

// TODO: rename to useGetPancakeSwapPairs
const useGetPairs = (input: Omit<GetPairsInput, 'multicall'>, options?: Options) => {
  const multicall = useMulticall();

  // Generate function key based on token combinations
  const tokenCombinationIds = input.tokenCombinations.map(generateTokenCombinationId);

  return useQuery(
    [FunctionKey.GET_PAIR_RESERVES, ...tokenCombinationIds],
    () => getPairs({ multicall, ...input }),
    {
      // Refresh request on every new block
      refetchInterval: BLOCK_TIME_MS,
      staleTime: 0,
      cacheTime: 0,
      ...options,
    },
  );
};

export default useGetPairs;
