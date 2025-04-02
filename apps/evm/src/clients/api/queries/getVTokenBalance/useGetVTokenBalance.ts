import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetVTokenBalanceInput,
  type GetVTokenBalanceOutput,
  getVTokenBalance,
} from 'clients/api/queries/getVTokenBalance';
import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import type { Address } from 'viem';

type TrimmedGetVTokenBalanceInput = Omit<GetVTokenBalanceInput, 'publicClient'>;

export type UseGetVTokenBalanceQueryKey = [
  FunctionKey.GET_V_TOKEN_BALANCE,
  Omit<TrimmedGetVTokenBalanceInput, 'vToken'> & {
    vTokenAddress: Address;
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetVTokenBalanceOutput,
  Error,
  GetVTokenBalanceOutput,
  GetVTokenBalanceOutput,
  UseGetVTokenBalanceQueryKey
>;

export const useGetVTokenBalance = (
  { accountAddress, vTokenAddress }: TrimmedGetVTokenBalanceInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [FunctionKey.GET_V_TOKEN_BALANCE, { accountAddress, vTokenAddress, chainId }],

    queryFn: () =>
      getVTokenBalance({
        vTokenAddress,
        publicClient,
        accountAddress,
      }),
    ...options,
  });
};
