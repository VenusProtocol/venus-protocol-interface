import { type QueryObserverOptions, keepPreviousData, useQuery } from '@tanstack/react-query';

import getTransactions, {
  type GetTransactionsInput,
  type GetTransactionsOutput,
} from 'clients/api/queries/getTransactions';
import useGetVTokens from 'clients/api/queries/getVTokens/useGetVTokens';
import FunctionKey from 'constants/functionKey';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { generatePseudoRandomRefetchInterval } from 'utilities';

type TrimmedGetTransactionsInput = Omit<
  GetTransactionsInput,
  'vTokens' | 'tokens' | 'defaultToken'
>;

type Options = QueryObserverOptions<
  GetTransactionsOutput,
  Error,
  GetTransactionsOutput,
  GetTransactionsOutput,
  [FunctionKey.GET_TRANSACTIONS, TrimmedGetTransactionsInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetTransactions = (params: TrimmedGetTransactionsInput, options?: Partial<Options>) => {
  const { data: getVTokenData } = useGetVTokens();
  const vTokens = getVTokenData?.vTokens || [];

  const tokens = useGetTokens();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_TRANSACTIONS, params],
    queryFn: () => getTransactions({ ...params, vTokens, tokens, defaultToken: xvs || tokens[0] }),
    placeholderData: keepPreviousData,
    refetchInterval,
    ...options,
    enabled: vTokens.length > 0 && (!options || options.enabled),
  });
};

export default useGetTransactions;
