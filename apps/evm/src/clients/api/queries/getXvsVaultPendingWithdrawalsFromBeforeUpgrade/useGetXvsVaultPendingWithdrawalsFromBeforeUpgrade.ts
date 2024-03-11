import { type QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultPendingWithdrawalsFromBeforeUpgrade, {
  type GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  type GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
} from 'clients/api/queries/getXvsVaultPendingWithdrawalsFromBeforeUpgrade';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput = Omit<
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  'xvsVaultContract'
>;

export type UseGetXvsVaultPendingWithdrawalsFromBeforeUpgradeQueryKey = [
  FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE,
  TrimmedGetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  Error,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  UseGetXvsVaultPendingWithdrawalsFromBeforeUpgradeQueryKey
>;

const useGetXvsVaultPendingWithdrawalsFromBeforeUpgrade = (
  input: TrimmedGetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  options?: Options,
) => {
  const { chainId } = useChainId();
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE, { ...input, chainId }],
    () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultPendingWithdrawalsFromBeforeUpgrade({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsVaultPendingWithdrawalsFromBeforeUpgrade;
