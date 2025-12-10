import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { getBlockTimeByChainId } from '@venusprotocol/chains';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetBlockNumberOutput, getBlockNumber } from '.';

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

export const useGetBlockNumber = (input?: Input, options?: Partial<Options>) => {
  const { chainId: currentChainId } = useChainId();
  const chainId = input?.chainId ?? currentChainId;
  const { publicClient } = usePublicClient({ chainId });
  const { blockTimeMs } = getBlockTimeByChainId({ chainId }) ?? {};

  return useQuery({
    queryKey: [FunctionKey.GET_BLOCK_NUMBER, { chainId }],
    queryFn: () => getBlockNumber({ publicClient }),
    refetchInterval: blockTimeMs || DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });
};
