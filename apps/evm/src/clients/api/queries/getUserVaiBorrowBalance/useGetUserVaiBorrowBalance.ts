import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetUserVaiBorrowBalanceInput,
  type GetUserVaiBorrowBalanceOutput,
  getUserVaiBorrowBalance,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiControllerContractAddress } from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetUserVaiBorrowBalanceInput = Omit<
  GetUserVaiBorrowBalanceInput,
  'publicClient' | 'vaiControllerContractAddress' | 'multicallContractAddress'
>;

export type UseGetUserVaiBorrowBalanceQueryKey = [
  FunctionKey.GET_USER_VAI_BORROW_BALANCE,
  TrimmedGetUserVaiBorrowBalanceInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetUserVaiBorrowBalanceOutput | undefined,
  Error,
  GetUserVaiBorrowBalanceOutput | undefined,
  GetUserVaiBorrowBalanceOutput | undefined,
  UseGetUserVaiBorrowBalanceQueryKey
>;

const useGetUserVaiBorrowBalance = (
  { accountAddress }: TrimmedGetUserVaiBorrowBalanceInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const vaiControllerContractAddress = useGetVaiControllerContractAddress();
  const { publicClient } = usePublicClient();

  return useQuery({
    queryKey: [
      FunctionKey.GET_USER_VAI_BORROW_BALANCE,
      {
        accountAddress,
        chainId,
      },
    ],
    queryFn: () =>
      callOrThrow({ vaiControllerContractAddress }, params =>
        getUserVaiBorrowBalance({
          accountAddress,
          publicClient,
          ...params,
        }),
      ),
    ...options,
  });
};

export default useGetUserVaiBorrowBalance;
