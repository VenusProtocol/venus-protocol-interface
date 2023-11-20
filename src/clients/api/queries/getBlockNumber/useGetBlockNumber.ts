import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';

import { getBlockNumber } from 'clients/api/';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';

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
  const { blockTimeMs } = useGetChainMetadata();

  return useQuery([FunctionKey.GET_BLOCK_NUMBER, { chainId }], () => getBlockNumber({ provider }), {
    refetchInterval: blockTimeMs,
    ...options,
  });
};

export default useGetBlockNumber;
