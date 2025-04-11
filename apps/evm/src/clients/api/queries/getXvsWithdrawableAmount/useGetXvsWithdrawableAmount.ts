import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsWithdrawableAmountInput,
  type GetXvsWithdrawableAmountOutput,
  getXvsWithdrawableAmount,
} from 'clients/api/queries/getXvsWithdrawableAmount';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVestingContractAddress } from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsWithdrawableAmountInput = Omit<
  GetXvsWithdrawableAmountInput,
  'publicClient' | 'xvsVestingContractAddress'
>;

export type UseGetXvsWithdrawableAmountQueryKey = [
  FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT,
  TrimmedGetXvsWithdrawableAmountInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsWithdrawableAmountOutput | undefined,
  Error,
  GetXvsWithdrawableAmountOutput | undefined,
  GetXvsWithdrawableAmountOutput | undefined,
  UseGetXvsWithdrawableAmountQueryKey
>;

export const useGetXvsWithdrawableAmount = (
  input: TrimmedGetXvsWithdrawableAmountInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const xvsVestingContractAddress = useGetXvsVestingContractAddress();

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ xvsVestingContractAddress }, params =>
        getXvsWithdrawableAmount({
          ...params,
          ...input,
          publicClient,
        }),
      ),
    ...options,
  });
};
