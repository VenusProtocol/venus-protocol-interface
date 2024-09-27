import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getBlockNumber, { type GetBlockNumberOutput } from 'clients/api/queries/getBlockNumber';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useChainId, useProvider } from 'libs/wallet';

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

const useGetBlockNumber = (input?: Input, options?: Partial<Options>) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId ?? currentChainId;
  const { provider } = useProvider({ chainId });
  const { blockTimeMs } = useGetChainMetadata();

  return useQuery({
    queryKey: [FunctionKey.GET_BLOCK_NUMBER, { chainId }],
    queryFn: () => getBlockNumber({ provider }),
    refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });
};

export default useGetBlockNumber;
