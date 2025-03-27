import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetVTokenBalanceInput,
  type GetVTokenBalanceOutput,
  getVTokenBalance,
} from 'clients/api/queries/getVTokenBalance';
import FunctionKey from 'constants/functionKey';
import { useGetVTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId, VToken } from 'types';
import { callOrThrow } from 'utilities';

interface TrimmedGetVTokenBalanceInput extends Omit<GetVTokenBalanceInput, 'vTokenContract'> {
  vToken: VToken;
}

export type UseGetVTokenBalanceQueryKey = [
  FunctionKey.GET_V_TOKEN_BALANCE,
  Omit<TrimmedGetVTokenBalanceInput, 'vToken'> & {
    vTokenAddress: string;
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
  { accountAddress, vToken }: TrimmedGetVTokenBalanceInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const vTokenContract = useGetVTokenContract({ vToken });

  return useQuery({
    queryKey: [
      FunctionKey.GET_V_TOKEN_BALANCE,
      { accountAddress, vTokenAddress: vToken.address, chainId },
    ],

    queryFn: () =>
      callOrThrow({ vTokenContract }, params =>
        getVTokenBalance({
          ...params,
          accountAddress,
        }),
      ),

    ...options,
  });
};
