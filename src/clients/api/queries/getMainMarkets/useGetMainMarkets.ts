import { QueryObserverOptions, useQuery } from 'react-query';

import getMainMarkets, { GetMainMarketsOutput } from 'clients/api/queries/getMainMarkets';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMainMarketsOutput,
  Error,
  GetMainMarketsOutput,
  GetMainMarketsOutput,
  FunctionKey.GET_MAIN_MARKETS
>;

const useGetMainMarkets = (options?: Options) =>
  useQuery(FunctionKey.GET_MAIN_MARKETS, getMainMarkets, {
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetMainMarkets;
