import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';

import { getBlockNumber } from 'clients/api/';
import { BLOCK_TIME_MS } from 'constants/bsc';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

export type UseGetBlockNumber = [FunctionKey.GET_BLOCK_NUMBER, { chainId: ChainId }];

interface GetBlockNumberOutput {
  blockNumber: number;
}

type Options = QueryObserverOptions<
  GetBlockNumberOutput,
  Error,
  GetBlockNumberOutput,
  GetBlockNumberOutput,
  UseGetBlockNumber
>;

const useGetBlockNumber = (options?: Options) => {
  const { provider, chainId } = useAuth();

  return useQuery([FunctionKey.GET_BLOCK_NUMBER, { chainId }], () => getBlockNumber({ provider }), {
    refetchInterval: BLOCK_TIME_MS,
    ...options,
  });
};

export default useGetBlockNumber;
