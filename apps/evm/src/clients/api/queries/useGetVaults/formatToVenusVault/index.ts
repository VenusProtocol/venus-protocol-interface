import { VaultCategory, VaultManager, VaultStatus, type VenusVault } from 'types';

export type VaultData = Omit<VenusVault, 'key' | 'category' | 'manager' | 'managerIcon' | 'status'>;

export const formatToVenusVault = (vault: VaultData): VenusVault => {
  const venusVault: VenusVault = {
    ...vault,
    key: `${VaultManager.Venus}-${vault.stakedToken.symbol}-${vault.rewardToken.symbol}-${
      vault.lockingPeriodMs || 0
    }`,
    category:
      vault.stakedToken.symbol === 'XVS' ? VaultCategory.GOVERNANCE : VaultCategory.STABLECOINS,
    manager: VaultManager.Venus,
    managerIcon: 'logoMobile' as const,
    status:
      vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade
        ? VaultStatus.Paused
        : VaultStatus.Active,
  };

  return venusVault;
};
