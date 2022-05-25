import { useQuery, QueryObserverOptions } from 'react-query';
import getMarkets, { GetMarketsOutput } from 'clients/api/queries/getMarkets';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMarketsOutput,
  Error,
  GetMarketsOutput,
  GetMarketsOutput,
  FunctionKey.GET_MARKETS
>;

const useGetMarkets = (options?: Options) => useQuery(FunctionKey.GET_MARKETS, getMarkets, options);

export default useGetMarkets;
