import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import type { Address } from 'viem';
import { type GetVTokenBalancesInput, type GetVTokenBalancesOutput, getVTokenBalances } from '.';

export type UseGetVTokenBalancesQueryKey = [
  FunctionKey.GET_VTOKEN_BALANCES,
  {
    accountAddress: Address;
    chainId: ChainId;
  },
  ...Address[],
];

type Options = QueryObserverOptions<
  GetVTokenBalancesOutput,
  Error,
  GetVTokenBalancesOutput,
  GetVTokenBalancesOutput,
  UseGetVTokenBalancesQueryKey
>;

export const useGetVTokenBalances = (
  { accountAddress, vTokens }: Omit<GetVTokenBalancesInput, 'publicClient'>,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();

  // Sort addresses alphabetically to prevent unnecessary re-renders
  const sortedVTokenAddresses = [...vTokens].map(token => token.address).sort();

  return useQuery({
    queryKey: [
      FunctionKey.GET_VTOKEN_BALANCES,
      {
        accountAddress,
        chainId,
      },
      ...sortedVTokenAddresses,
    ],

    queryFn: () => getVTokenBalances({ accountAddress, vTokens, publicClient }),
    ...options,
  });
};
