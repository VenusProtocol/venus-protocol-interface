import { QueryObserverOptions, useQuery } from 'react-query';

import { GetBalanceOfInput, GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useChainId, useProvider } from 'packages/wallet';
import { ChainId } from 'types';

type TrimmedGetBalanceOfInput = Omit<GetBalanceOfInput, 'signer' | 'provider'>;

export type UseGetBalanceOfQueryKey = [
  FunctionKey.GET_BALANCE_OF,
  Omit<TrimmedGetBalanceOfInput, 'token'> & {
    tokenAddress: string;
    chainId: ChainId;
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
  { accountAddress, token }: TrimmedGetBalanceOfInput,
  options?: Options,
) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();

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
