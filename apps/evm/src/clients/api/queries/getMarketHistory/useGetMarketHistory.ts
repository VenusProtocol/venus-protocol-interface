import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getMarketHistory, {
  type GetMarketHistoryInput,
  type GetMarketHistoryOutput,
} from 'clients/api/queries/getMarketHistory';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMarketHistoryOutput,
  Error,
  GetMarketHistoryOutput,
  GetMarketHistoryOutput,
  [FunctionKey.GET_MARKET_HISTORY, { vTokenAddress: string }]
>;

const useGetMarketHistory = (input: GetMarketHistoryInput, options?: Partial<Options>) =>
  useQuery({
    queryKey: [FunctionKey.GET_MARKET_HISTORY, { vTokenAddress: input.vToken.address }],
    queryFn: () => getMarketHistory(input),
    ...options,
  });

export default useGetMarketHistory;
