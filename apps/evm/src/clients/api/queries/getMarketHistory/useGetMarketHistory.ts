import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import {
  type GetMarketHistoryInput,
  type GetMarketHistoryOutput,
  type MarketHistoryPeriodType,
  getMarketHistory,
} from '.';

type Options = QueryObserverOptions<
  GetMarketHistoryOutput,
  Error,
  GetMarketHistoryOutput,
  GetMarketHistoryOutput,
  [FunctionKey.GET_MARKET_HISTORY, { vTokenAddress: string; period: MarketHistoryPeriodType }]
>;

export const useGetMarketHistory = (input: GetMarketHistoryInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [
      FunctionKey.GET_MARKET_HISTORY,
      { vTokenAddress: input.vToken.address, period: input.period },
    ],
    queryFn: () => getMarketHistory(input),
    ...options,
  });
