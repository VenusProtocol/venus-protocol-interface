import { Multicall } from 'ethereum-multicall';
import { QueryObserverOptions, useQuery } from 'react-query';

import getPairs, { GetPairsInput, GetPairsOutput } from 'clients/api/queries/getPairs';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

import generateTokenCombinationId from './generateTokenCombinationId';

type Options = QueryObserverOptions<
  GetPairsOutput,
  Error,
  GetPairsOutput,
  GetPairsOutput,
  [FunctionKey.GET_PAIR_RESERVES, ...string[]]
>;

const useGetPairs = (input: Omit<GetPairsInput, 'multicall'>, options?: Options) => {
  // TODO: import global multicall instance via hook (TODO: create useMulticall
  // hook)
  const web3 = useWeb3();
  const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

  // Generate function key based on token combinations
  const tokenCombinationIds = input.tokenCombinations.map(generateTokenCombinationId);

  return useQuery(
    [FunctionKey.GET_PAIR_RESERVES, ...tokenCombinationIds],
    () => getPairs({ multicall, ...input }),
    options,
  );
};

export default useGetPairs;
