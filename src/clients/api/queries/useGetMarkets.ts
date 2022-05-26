import { useQuery, QueryObserverOptions } from 'react-query';
import getMarkets, { IGetMarketsOutput } from 'clients/api/queries/getMarkets';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetMarketsOutput,
  Error,
  IGetMarketsOutput,
  IGetMarketsOutput,
  FunctionKey.GET_MARKETS
>;

const useGetMarkets = (options?: Options) => useQuery(FunctionKey.GET_MARKETS, getMarkets, options);

export default useGetMarkets;
