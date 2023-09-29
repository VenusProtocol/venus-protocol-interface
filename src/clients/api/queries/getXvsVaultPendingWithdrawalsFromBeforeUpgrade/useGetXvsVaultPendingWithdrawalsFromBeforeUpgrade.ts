import { useGetXvsVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsVaultPendingWithdrawalsFromBeforeUpgrade, {
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
} from 'clients/api/queries/getXvsVaultPendingWithdrawalsFromBeforeUpgrade';
import FunctionKey from 'constants/functionKey';

type TrimmedGetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput = Omit<
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  'xvsVaultContract'
>;
type Options = QueryObserverOptions<
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  Error,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  [
    FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE,
    TrimmedGetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  ]
>;

const useGetXvsVaultPendingWithdrawalsFromBeforeUpgrade = (
  input: TrimmedGetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  options?: Options,
) => {
  const xvsVaultContract = useGetXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE, input],
    () =>
      callOrThrow({ xvsVaultContract }, params =>
        getXvsVaultPendingWithdrawalsFromBeforeUpgrade({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsVaultPendingWithdrawalsFromBeforeUpgrade;
