import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import { type GetBalanceOfInput, type GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useChainId, useProvider } from 'libs/wallet';
import type { Token } from 'types';
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

const useGetBalanceOf = (
  { accountAddress, token }: UseGetBalanceOfInput,
  options?: Partial<Options>,
) => {
  const { provider } = useProvider();
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_BALANCE_OF,
      {
        chainId,
        accountAddress,
        tokenAddress: token?.address || '',
      },
    ],

    queryFn: () =>
      callOrThrow({ token }, params =>
        getBalanceOf({
          provider,
          accountAddress,
          ...params,
        }),
      ),

    ...options,
  });
};

export default useGetBalanceOf;
