import { VaultCategory, type VaultData, VaultManager, VaultStatus } from 'types';

export const injectMetadata = (vault?: VaultData) => {
  if (!vault) return vault;

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
