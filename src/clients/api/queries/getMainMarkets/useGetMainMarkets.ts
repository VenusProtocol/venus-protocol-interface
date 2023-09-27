import { QueryObserverOptions, useQuery } from 'react-query';

import getMainMarkets, { GetMainMarketsOutput } from 'clients/api/queries/getMainMarkets';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMainMarketsOutput,
  Error,
  GetMainMarketsOutput,
  GetMainMarketsOutput,
  FunctionKey.GET_MAIN_MARKETS
>;

const useGetMainMarkets = (options?: Options) =>
  useQuery(FunctionKey.GET_MAIN_MARKETS, getMainMarkets, options);

export default useGetMainMarkets;
