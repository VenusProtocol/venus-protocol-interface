import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { type ApiMarketsTvl, getMarketsTvl } from '.';

export type UseGetMarketsTvlQueryKey = [FunctionKey.GET_MARKETS_TVL];

type Options = QueryObserverOptions<
  ApiMarketsTvl,
  Error,
  ApiMarketsTvl,
  ApiMarketsTvl,
  UseGetMarketsTvlQueryKey
>;

export const useGetMarketsTvl = (options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_MARKETS_TVL],
    queryFn: getMarketsTvl,
    ...options,
  });
