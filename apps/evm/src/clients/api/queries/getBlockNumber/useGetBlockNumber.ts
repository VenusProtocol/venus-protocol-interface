import { QueryObserverOptions, useQuery } from 'react-query';

import { getBlockNumber } from 'clients/api/';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId, useProvider } from 'packages/wallet';
import { ChainId } from 'types';

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
  const { provider } = useProvider();
  const { chainId } = useChainId();
  const { blockTimeMs } = useGetChainMetadata();

  return useQuery([FunctionKey.GET_BLOCK_NUMBER, { chainId }], () => getBlockNumber({ provider }), {
    refetchInterval: blockTimeMs,
    ...options,
  });
};

export default useGetBlockNumber;
