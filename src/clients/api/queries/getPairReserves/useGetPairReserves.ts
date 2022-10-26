import { Multicall } from 'ethereum-multicall';
import { QueryObserverOptions, useQuery } from 'react-query';

import getPairReserves, {
  GetPairReservesInput,
  GetPairReservesOutput,
} from 'clients/api/queries/getPairReserves';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

import generateTokenCombinationId from './generateTokenCombinationId';

type Options = QueryObserverOptions<
  GetPairReservesOutput,
  Error,
  GetPairReservesOutput,
  GetPairReservesOutput,
  [FunctionKey.GET_PAIR_RESERVES, ...string[]]
>;

const useGetPairReserves = (input: Omit<GetPairReservesInput, 'multicall'>, options?: Options) => {
  // TODO: import global multicall instance via hook (TODO: create useMulticall
  // hook)
  const web3 = useWeb3();
  const multicall = new Multicall({ web3Instance: web3, tryAggregate: true });

  // Generate function key based on token combinations
  const tokenCombinationIds = input.tokenCombinations.map(generateTokenCombinationId);

  return useQuery(
    [FunctionKey.GET_PAIR_RESERVES, ...tokenCombinationIds],
    () => getPairReserves({ multicall, ...input }),
    options,
  );
};

export default useGetPairReserves;
