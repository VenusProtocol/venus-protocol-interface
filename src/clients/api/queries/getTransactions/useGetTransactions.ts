import { QueryObserverOptions, useQuery } from 'react-query';
import { VenusTokenSymbol } from 'types';

import getTransactions, {
  GetTransactionsInput,
  GetTransactionsOutput,
} from 'clients/api/queries/getTransactions';
import useGetVTokens from 'clients/api/queries/getVTokens/useGetVTokens';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import useGetTokens from 'hooks/useGetTokens';
import useGetVenusToken from 'hooks/useGetVenusToken';

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

  const tokens = useGetTokens();
  const xvs = useGetVenusToken({
    symbol: VenusTokenSymbol.XVS,
  });

  return useQuery(
    [FunctionKey.GET_TRANSACTIONS, { ...params, vTokens }],
    () => getTransactions({ ...params, vTokens, tokens, defaultToken: xvs || tokens[0] }),
    {
      keepPreviousData: true,
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
      enabled: vTokens.length > 0 && (!options || options.enabled),
    },
  );
};

export default useGetTransactions;
