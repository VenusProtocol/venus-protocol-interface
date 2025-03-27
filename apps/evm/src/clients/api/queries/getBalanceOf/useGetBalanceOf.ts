import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId, Token } from 'types';
import { callOrThrow } from 'utilities';
import { type GetBalanceOfInput, type GetBalanceOfOutput, getBalanceOf } from '.';

type TrimmedGetBalanceOfInput = Omit<GetBalanceOfInput, 'publicClient'>;

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

export const useGetBalanceOf = (
  { accountAddress, token }: UseGetBalanceOfInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_BALANCE_OF,
      {
        chainId,
        accountAddress,
        tokenAddress: token?.address || NULL_ADDRESS,
      },
    ],
    queryFn: () =>
      callOrThrow({ token }, params =>
        getBalanceOf({
          publicClient,
          accountAddress,
          ...params,
        }),
      ),
    ...options,
  });
};
