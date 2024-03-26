import { type QueryObserverOptions, useQuery } from 'react-query';

import getBlockNumber, { type GetBlockNumberOutput } from 'clients/api/queries/getBlockNumber';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId, useProvider } from 'libs/wallet';
import type { ChainId } from 'types';

export type UseGetBlockNumberQueryKey = [FunctionKey.GET_BLOCK_NUMBER, { chainId: ChainId }];

interface Input {
  chainId?: ChainId;
}

type Options = QueryObserverOptions<
  GetBlockNumberOutput,
  Error,
  GetBlockNumberOutput,
  GetBlockNumberOutput,
  UseGetBlockNumberQueryKey
>;

const useGetBlockNumber = (input?: Input, options?: Options) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId ?? currentChainId;
  const { provider } = useProvider({ chainId });
  const { blockTimeMs } = useGetChainMetadata();

  return useQuery([FunctionKey.GET_BLOCK_NUMBER, { chainId }], () => getBlockNumber({ provider }), {
    refetchInterval: blockTimeMs,
    ...options,
  });
};

export default useGetBlockNumber;
