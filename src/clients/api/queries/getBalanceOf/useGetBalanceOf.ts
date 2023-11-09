import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';

import { GetBalanceOfInput, GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

export type UseGetBalanceOfQueryKey = [
  FunctionKey.GET_BALANCE_OF,
  {
    chainId: ChainId;
    accountAddress: string;
    tokenAddress: string;
  },
];

type Options = QueryObserverOptions<
  GetBalanceOfOutput,
  Error,
  GetBalanceOfOutput,
  GetBalanceOfOutput,
  UseGetBalanceOfQueryKey
>;

const useGetBalanceOf = (
  { accountAddress, token }: Omit<GetBalanceOfInput, 'signer' | 'provider'>,
  options?: Options,
) => {
  const { provider, chainId } = useAuth();

  return useQuery(
    [
      FunctionKey.GET_BALANCE_OF,
      {
        chainId,
        accountAddress,
        tokenAddress: token.address,
      },
    ],
    () => getBalanceOf({ provider, accountAddress, token }),
    options,
  );
};

export default useGetBalanceOf;
