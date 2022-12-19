import { QueryObserverOptions, useQuery } from 'react-query';

import getMainMarketHistory, {
  GetMainMarketHistoryInput,
  GetMainMarketHistoryOutput,
} from 'clients/api/queries/getMainMarketHistory';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMainMarketHistoryOutput,
  Error,
  GetMainMarketHistoryOutput,
  GetMainMarketHistoryOutput,
  [FunctionKey.GET_MARKET_HISTORY, { vTokenAddress: string }]
>;

const useGetMainMarketHistory = (input: GetMainMarketHistoryInput, options?: Options) =>
  useQuery(
    [FunctionKey.GET_MARKET_HISTORY, { vTokenAddress: input.vToken.address }],
    () => getMainMarketHistory(input),
    options,
  );

export default useGetMainMarketHistory;
