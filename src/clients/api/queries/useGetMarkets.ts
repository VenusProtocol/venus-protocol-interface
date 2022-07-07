import { useQuery, QueryObserverOptions } from 'react-query';

import getMarkets, { IGetMarketsOutput } from 'clients/api/queries/getMarkets';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';

type Options = QueryObserverOptions<
  IGetMarketsOutput,
  Error,
  IGetMarketsOutput,
  IGetMarketsOutput,
  FunctionKey.GET_MARKETS
>;

const useGetMarkets = (options?: Options) =>
  useQuery(FunctionKey.GET_MARKETS, getMarkets, {
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetMarkets;
