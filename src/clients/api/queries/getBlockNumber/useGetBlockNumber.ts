import { useQuery, QueryObserverOptions } from 'react-query';

import { BLOCK_TIME_MS } from 'constants/bsc';
import { useWeb3 } from 'clients/web3';
import { getBlockNumber } from 'clients/api/';
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
  const web3 = useWeb3();
  return useQuery(FunctionKey.GET_BLOCK_NUMBER, () => getBlockNumber({ web3 }), {
    refetchInterval: BLOCK_TIME_MS,
    ...options,
  });
};

export default useGetBlockNumber;
