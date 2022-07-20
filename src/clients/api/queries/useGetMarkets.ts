import { QueryObserverOptions, useQuery } from 'react-query';

import getMarkets, { GetMarketsOutput } from 'clients/api/queries/getMarkets';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMarketsOutput,
  Error,
  GetMarketsOutput,
  GetMarketsOutput,
  FunctionKey.GET_MARKETS
>;

const useGetMarkets = (options?: Options) =>
  useQuery(FunctionKey.GET_MARKETS, getMarkets, {
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetMarkets;
