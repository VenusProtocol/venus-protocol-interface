import { VaultCategory, VaultManager, VaultStatus, VaultType, type VenusVault } from 'types';

export type VaultData = Omit<
  VenusVault,
  'key' | 'category' | 'manager' | 'managerIcon' | 'status' | 'vaultType'
>;

export const formatToVenusVault = (vault: VaultData): VenusVault => {
  const venusVault: VenusVault = {
    ...vault,
    key: `${VaultManager.Venus}-${vault.stakedToken.symbol}-${vault.rewardToken.symbol}-${
      vault.lockingPeriodMs || 0
    }`,
    category: vault.stakedToken.symbol === 'VAI' ? VaultCategory.Stablecoins : VaultCategory.Others,
    vaultType: VaultType.Venus,
    manager: VaultManager.Venus,
    managerIcon: 'logoMobile' as const,
    status:
      vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade
        ? VaultStatus.Paused
        : VaultStatus.Active,
  };

  return venusVault;
};
