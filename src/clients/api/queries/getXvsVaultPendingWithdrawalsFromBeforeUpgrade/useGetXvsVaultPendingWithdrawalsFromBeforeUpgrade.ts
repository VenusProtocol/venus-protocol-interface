import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultPendingWithdrawalsFromBeforeUpgrade, {
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
} from 'clients/api/queries/getXvsVaultPendingWithdrawalsFromBeforeUpgrade';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  Error,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  [
    FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE,
    Omit<GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput, 'xvsVaultContract'>,
  ]
>;

const useGetXvsVaultPendingWithdrawalsFromBeforeUpgrade = (
  params: Omit<GetXvsVaultPendingWithdrawalsFromBeforeUpgradeInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE, params],
    () => getXvsVaultPendingWithdrawalsFromBeforeUpgrade({ xvsVaultContract, ...params }),
    options,
  );
};

export default useGetXvsVaultPendingWithdrawalsFromBeforeUpgrade;
