import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { type GetTopMarketsResponse, getTopMarkets } from '.';

export type UseGetTopMarketsQueryKey = [FunctionKey.GET_TOP_MARKETS, { chainId: ChainId }];

type Options = QueryObserverOptions<
  GetTopMarketsResponse,
  Error,
  GetTopMarketsResponse,
  GetTopMarketsResponse,
  UseGetTopMarketsQueryKey
>;

export const useGetTopMarkets = (options?: Partial<Options>) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [FunctionKey.GET_TOP_MARKETS, { chainId }],
    queryFn: () => getTopMarkets({ chainId }),
    ...options,
  });
};
