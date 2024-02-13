import { useChainId, useProvider } from 'libs/wallet';
import { QueryObserverOptions, useQuery } from 'react-query';

import { GetBalanceOfInput, GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { ChainId, Token } from 'types';
import { callOrThrow } from 'utilities';

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

interface UseGetBalanceOfInput extends Omit<TrimmedGetBalanceOfInput, 'token'> {
  token?: Token;
}

const useGetBalanceOf = ({ accountAddress, token }: UseGetBalanceOfInput, options?: Options) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();

  return useQuery(
    [
      FunctionKey.GET_BALANCE_OF,
      {
        chainId,
        accountAddress,
        tokenAddress: token?.address || '',
      },
    ],
    () =>
      callOrThrow({ token }, params =>
        getBalanceOf({
          provider,
          accountAddress,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetBalanceOf;
