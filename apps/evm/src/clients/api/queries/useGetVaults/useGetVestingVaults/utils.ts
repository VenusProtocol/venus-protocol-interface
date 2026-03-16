import { VaultCategory, type VaultData, VaultManager, VaultStatus } from 'types';

export const injectMetadata = (vaults?: VaultData[]) => {
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
