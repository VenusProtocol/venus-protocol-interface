import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade, {
  type GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput,
  type GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
} from 'clients/api/queries/getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput = Omit<
  GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput,
  'xvsVaultContract'
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

const useGetXvsVaultUserPendingWithdrawalsFromBeforeUpgrade = (
  input: TrimmedGetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery({
    queryKey: [
      FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE,
      { ...input, chainId },
    ],

    queryFn: () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade({ ...params, ...input }),
      ),

    ...options,
  });
};

export default useGetXvsVaultUserPendingWithdrawalsFromBeforeUpgrade;
