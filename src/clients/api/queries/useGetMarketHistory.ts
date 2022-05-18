import { useQuery, QueryObserverOptions } from 'react-query';
import getMarketHistory, {
  IGetMarketHistoryInput,
  GetMarketHistoryOutput,
} from 'clients/api/queries/getMarketHistory';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMarketHistoryOutput,
  Error,
  GetMarketHistoryOutput,
  GetMarketHistoryOutput,
  FunctionKey.GET_MARKET_HISTORY
>;

const useGetMarketHistory = (input: IGetMarketHistoryInput, options?: Options) =>
  useQuery(FunctionKey.GET_MARKET_HISTORY, () => getMarketHistory(input), options);

export default useGetMarketHistory;
