import { QueryObserverOptions, useQuery } from 'react-query';

import { GetTokenBalancesInput, GetTokenBalancesOutput, getTokenBalances } from 'clients/api';
import { useMulticall3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

export type Options = QueryObserverOptions<
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
  { accountAddress, tokens }: Omit<GetTokenBalancesInput, 'multicall3' | 'provider'>,
  options?: Options,
) => {
  const multicall3 = useMulticall3();
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
    () => getTokenBalances({ multicall3, accountAddress, tokens, provider }),
    options,
  );
};

export default useGetTokenBalances;
