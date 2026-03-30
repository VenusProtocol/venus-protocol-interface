import { VaultCategory, VaultManager, VaultStatus, type VenusVault } from 'types';

type VaultData = Omit<VenusVault, 'key' | 'category' | 'manager' | 'managerIcon' | 'status'>;

export const injectMetadata = (vault?: VaultData): VenusVault | undefined => {
  if (!vault) return undefined;

  return {
    ...vault,
    key: `${VaultManager.Venus}-${vault.stakedToken.symbol}-${vault.rewardToken.symbol}-${
      vault.lockingPeriodMs || 0
    }`,
    category: VaultCategory.Stablecoins,
    manager: VaultManager.Venus,
    managerIcon: 'logoMobile' as const,
    status:
      vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade
        ? VaultStatus.Paused
        : VaultStatus.Active,
  };
};
