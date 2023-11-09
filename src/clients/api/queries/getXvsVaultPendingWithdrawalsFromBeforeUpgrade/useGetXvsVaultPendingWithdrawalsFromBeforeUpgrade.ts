import { useGetXvsVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getXvsVaultPendingWithdrawalsFromBeforeUpgrade, {
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
} from 'clients/api/queries/getXvsVaultPendingWithdrawalsFromBeforeUpgrade';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

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
  const { chainId } = useAuth();
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
