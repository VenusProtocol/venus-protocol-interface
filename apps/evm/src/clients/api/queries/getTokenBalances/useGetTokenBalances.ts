import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import type { Address } from 'viem';
import { type GetTokenBalancesInput, type GetTokenBalancesOutput, getTokenBalances } from '.';

export type UseGetTokenBalancesQueryKey = [
  FunctionKey.GET_TOKEN_BALANCES,
  {
    accountAddress: Address;
    chainId: ChainId;
  },
  ...Address[],
];

export type Options = QueryObserverOptions<
  GetTokenBalancesOutput,
  Error,
  GetTokenBalancesOutput,
  GetTokenBalancesOutput,
  UseGetTokenBalancesQueryKey
>;

export const useGetTokenBalances = (
  { accountAddress, tokens }: Omit<GetTokenBalancesInput, 'publicClient'>,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();

  // Sort addresses alphabetically to prevent unnecessary re-renders
  const sortedTokenAddresses = [...tokens].map(token => token.address).sort();

  return useQuery({
    queryKey: [
      FunctionKey.GET_TOKEN_BALANCES,
      {
        accountAddress,
        chainId,
      },
      ...sortedTokenAddresses,
    ],

    queryFn: () => getTokenBalances({ accountAddress, tokens, publicClient }),
    ...options,
  });
};
