import { useQuery, QueryObserverOptions } from 'react-query';
import getTransactions, {
  IGetTransactionsInput,
  IGetTransactionsOutput,
} from 'clients/api/queries/getTransactions';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetTransactionsOutput,
  Error,
  IGetTransactionsOutput,
  IGetTransactionsOutput,
  [FunctionKey.GET_TRANSACTIONS, IGetTransactionsInput]
>;

const useGetTransactions = (params: IGetTransactionsInput, options?: Options) =>
  useQuery([FunctionKey.GET_TRANSACTIONS, params], () => getTransactions(params), {
    ...options,
    keepPreviousData: true,
    placeholderData: { limit: 0, page: 0, total: 0, transactions: [] },
  });

export default useGetTransactions;
