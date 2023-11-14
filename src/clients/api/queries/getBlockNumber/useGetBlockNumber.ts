import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';

import { getBlockNumber } from 'clients/api/';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

export type UseGetBlockNumberQueryKey = [FunctionKey.GET_BLOCK_NUMBER, { chainId: ChainId }];

interface GetBlockNumberOutput {
  blockNumber: number;
}

type Options = QueryObserverOptions<
  GetBlockNumberOutput,
  Error,
  GetBlockNumberOutput,
  GetBlockNumberOutput,
  UseGetBlockNumberQueryKey
>;

const useGetBlockNumber = (options?: Options) => {
  const { provider, chainId } = useAuth();

  return useQuery([FunctionKey.GET_BLOCK_NUMBER, { chainId }], () => getBlockNumber({ provider }), {
    refetchInterval: CHAIN_METADATA[chainId].blockTimeMs,
    ...options,
  });
};

export default useGetBlockNumber;
