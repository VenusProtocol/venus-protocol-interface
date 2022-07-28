import { QueryObserverOptions, useQuery } from 'react-query';

import getTransactions, {
  GetTransactionsInput,
  GetTransactionsOutput,
} from 'clients/api/queries/getTransactions';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetTransactionsOutput,
  Error,
  GetTransactionsOutput,
  GetTransactionsOutput,
  [FunctionKey.GET_TRANSACTIONS, GetTransactionsInput]
>;

const useGetTransactions = (params: GetTransactionsInput, options?: Options) =>
  useQuery([FunctionKey.GET_TRANSACTIONS, params], () => getTransactions(params), {
    keepPreviousData: true,
    placeholderData: { limit: 0, page: 0, total: 0, transactions: [] },
    refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
    ...options,
  });

export default useGetTransactions;
