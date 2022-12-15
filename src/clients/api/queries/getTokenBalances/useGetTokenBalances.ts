import { QueryObserverOptions, useQuery } from 'react-query';

import { GetTokenBalancesInput, GetTokenBalancesOutput, getTokenBalances } from 'clients/api';
import { useMulticall, useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

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
  { accountAddress, tokens }: Omit<GetTokenBalancesInput, 'multicall' | 'web3'>,
  options?: Options,
) => {
  const multicall = useMulticall();
  const web3 = useWeb3();

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
    () => getTokenBalances({ multicall, web3, accountAddress, tokens }),
    options,
  );
};

export default useGetTokenBalances;
