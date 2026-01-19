import { useQuery } from '@tanstack/react-query';
import FunctionKey from 'constants/functionKey';
import { type TopMarketsParams, fetchTopMarkets } from '.';

export const useGetTopMarkets = (params?: TopMarketsParams) =>
  useQuery({
    queryKey: [FunctionKey.GET_TOP_MARKETS],
    queryFn: () => fetchTopMarkets(params),
  });
