import { QueryObserverOptions, useQuery } from 'react-query';

import { getBlockNumber } from 'clients/api/';
import { useAuth } from 'clients/web3';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';

interface GetBlockNumberOutput {
  blockNumber: number;
}

type Options = QueryObserverOptions<
  GetBlockNumberOutput,
  Error,
  GetBlockNumberOutput,
  GetBlockNumberOutput,
  FunctionKey.GET_BLOCK_NUMBER
>;

const useGetBlockNumber = (options?: Options) => {
  const { provider } = useAuth();

  return useQuery(FunctionKey.GET_BLOCK_NUMBER, () => getBlockNumber({ provider }), {
    refetchInterval: BLOCK_TIME_MS,
    ...options,
  });
};

export default useGetBlockNumber;
