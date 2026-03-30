import { VaultCategory, VaultManager, VaultStatus, type VenusVault } from 'types';

export type VaultData = Omit<VenusVault, 'key' | 'category' | 'manager' | 'managerIcon' | 'status'>;

export const injectMetadata = (vaults?: VaultData[]): VenusVault[] => {
  if (!Array.isArray(vaults)) return [];

  return vaults.map(vault => ({
    ...vault,
    key: `${VaultManager.Venus}-${vault.stakedToken.symbol}-${vault.rewardToken.symbol}-${
      vault.lockingPeriodMs || 0
    }`,
    category: VaultCategory.Others,
    manager: VaultManager.Venus,
    managerIcon: 'logoMobile' as const,
    status:
      vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade
        ? VaultStatus.Paused
        : VaultStatus.Active,
  }));
};
