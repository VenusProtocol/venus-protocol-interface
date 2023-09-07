import { QueryObserverOptions, useQuery } from 'react-query';

import getTransactions, {
  GetTransactionsInput,
  GetTransactionsOutput,
} from 'clients/api/queries/getTransactions';
import useGetVTokens from 'clients/api/queries/getVTokens/useGetVTokens';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type TrimmedGetTransactionsInput = Omit<GetTransactionsInput, 'vTokens'>;

type Options = QueryObserverOptions<
  GetTransactionsOutput,
  Error,
  GetTransactionsOutput,
  GetTransactionsOutput,
  [FunctionKey.GET_TRANSACTIONS, GetTransactionsInput]
>;

const useGetTransactions = (params: TrimmedGetTransactionsInput, options?: Options) => {
  const { data: getVTokenData } = useGetVTokens();
  const vTokens = getVTokenData?.vTokens || [];

  return useQuery(
    [FunctionKey.GET_TRANSACTIONS, { ...params, vTokens }],
    () => getTransactions({ ...params, vTokens }),
    {
      keepPreviousData: true,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
      enabled: vTokens.length > 0 && (!options || options.enabled),
    },
  );
};

export default useGetTransactions;
