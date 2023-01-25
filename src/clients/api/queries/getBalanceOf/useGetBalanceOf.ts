import { QueryObserverOptions, useQuery } from 'react-query';

import { GetBalanceOfInput, GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import { useAuth } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetBalanceOfOutput,
  Error,
  GetBalanceOfOutput,
  GetBalanceOfOutput,
  [
    FunctionKey.GET_BALANCE_OF,
    {
      accountAddress: string;
      tokenAddress: string;
    },
  ]
>;

const useGetBalanceOf = (
  { accountAddress, token }: Omit<GetBalanceOfInput, 'signer' | 'provider'>,
  options?: Options,
) => {
  const { provider } = useAuth();

  return useQuery(
    [
      FunctionKey.GET_BALANCE_OF,
      {
        accountAddress,
        tokenAddress: token.address,
      },
    ],
    () => getBalanceOf({ provider, accountAddress, token }),
    options,
  );
};

export default useGetBalanceOf;
