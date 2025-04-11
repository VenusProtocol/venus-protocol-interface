import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput,
  type GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
  getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade,
} from 'clients/api/queries/getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput = Omit<
  GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput,
  'publicClient' | 'xvsVaultContractAddress'
>;

export type UseGetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeQueryKey = [
  FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE,
  TrimmedGetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
  Error,
  GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
  GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
  UseGetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeQueryKey
>;

export const useGetXvsVaultUserPendingWithdrawalsFromBeforeUpgrade = (
  input: TrimmedGetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  return useQuery({
    queryKey: [
      FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE,
      { ...input, chainId },
    ],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade({
          ...params,
          ...input,
          publicClient,
        }),
      ),
    ...options,
  });
}; 