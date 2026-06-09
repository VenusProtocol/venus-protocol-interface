import { VaultCategory, VaultStatus, VaultType, VaultVenue, type VenusVault } from 'types';
import venusLogoSrc from './venus.svg';

export type VaultData = Omit<
  VenusVault,
  'key' | 'category' | 'venue' | 'venueIconSrc' | 'status' | 'vaultType'
>;

export const formatToVenusVault = (vault: VaultData): VenusVault => {
  const venusVault: VenusVault = {
    ...vault,
    key: `${VaultVenue.Venus}-${vault.stakedToken.symbol}-${vault.rewardToken.symbol}-${
      vault.lockingPeriodMs || 0
    }`,
    category:
      vault.stakedToken.symbol === 'XVS' ? VaultCategory.GOVERNANCE : VaultCategory.STABLECOINS,
    vaultType: VaultType.Venus,
    venue: VaultVenue.Venus,
    venueIconSrc: venusLogoSrc,
    status:
      vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade
        ? VaultStatus.Paused
        : VaultStatus.Active,
  };

  return venusVault;
};
