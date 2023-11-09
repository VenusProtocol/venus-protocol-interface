import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';

import { GetTokenBalancesInput, GetTokenBalancesOutput, getTokenBalances } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

export type UseGetTokenBalancesQueryKey = [
  FunctionKey.GET_TOKEN_BALANCES,
  {
    accountAddress: string;
    chainId: ChainId;
  },
  ...string[],
];

export type Options = QueryObserverOptions<
  GetTokenBalancesOutput,
  Error,
  GetTokenBalancesOutput,
  GetTokenBalancesOutput,
  UseGetTokenBalancesQueryKey
>;

const useGetTokenBalances = (
  { accountAddress, tokens }: Omit<GetTokenBalancesInput, 'multicall3' | 'provider'>,
  options?: Options,
) => {
  const { provider, chainId } = useAuth();

  // Sort addresses alphabetically to prevent unnecessary re-renders
  const sortedTokenAddresses = [...tokens].map(token => token.address).sort();

  return useQuery(
    [
      FunctionKey.GET_TOKEN_BALANCES,
      {
        accountAddress,
        chainId,
      },
      ...sortedTokenAddresses,
    ],
    () => getTokenBalances({ accountAddress, tokens, provider }),
    options,
  );
};

export default useGetTokenBalances;
