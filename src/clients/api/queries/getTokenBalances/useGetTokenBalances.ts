import { QueryObserverOptions, useQuery } from 'react-query';

import { GetTokenBalancesInput, GetTokenBalancesOutput, getTokenBalances } from 'clients/api';
import { useMulticall } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type Options = QueryObserverOptions<
  GetTokenBalancesOutput,
  Error,
  GetTokenBalancesOutput,
  GetTokenBalancesOutput,
  [
    FunctionKey.GET_TOKEN_BALANCES,
    {
      accountAddress: string;
    },
    ...string[],
  ]
>;

const useGetTokenBalances = (
  { accountAddress, tokens }: Omit<GetTokenBalancesInput, 'multicall' | 'provider'>,
  options?: Options,
) => {
  const multicall = useMulticall();
  const { provider } = useAuth();

  // Sort addresses alphabetically to prevent unnecessary re-renders
  const sortedTokenAddresses = [...tokens].map(token => token.address).sort();

  return useQuery(
    [
      FunctionKey.GET_TOKEN_BALANCES,
      {
        accountAddress,
      },
      ...sortedTokenAddresses,
    ],
    () => getTokenBalances({ multicall, accountAddress, tokens, provider }),
    options,
  );
};

export default useGetTokenBalances;
