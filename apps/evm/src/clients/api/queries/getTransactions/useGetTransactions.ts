import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import getTransactions, {
  type GetTransactionsInput,
  type GetTransactionsOutput,
} from 'clients/api/queries/getTransactions';
import FunctionKey from 'constants/functionKey';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { generatePseudoRandomRefetchInterval } from 'utilities';

type TrimmedGetTransactionsInput = Omit<GetTransactionsInput, 'tokens' | 'defaultToken'>;

type Options = QueryObserverOptions<
  GetTransactionsOutput,
  Error,
  GetTransactionsOutput,
  GetTransactionsOutput,
  [FunctionKey.GET_TRANSACTIONS, TrimmedGetTransactionsInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetTransactions = (params: TrimmedGetTransactionsInput, options?: Partial<Options>) => {
  const tokens = useGetTokens();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_TRANSACTIONS, params],
    queryFn: () => getTransactions({ ...params, tokens, defaultToken: xvs || tokens[0] }),
    placeholderData: keepPreviousData,
    refetchInterval,
    ...options,
  });
};

export default useGetTransactions;
