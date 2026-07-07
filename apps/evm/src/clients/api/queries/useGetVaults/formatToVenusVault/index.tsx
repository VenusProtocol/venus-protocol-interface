import { VaultCategory, VaultStatus, VaultType, VaultVenue, type VenusVault } from 'types';
import { getVenueIconSrc } from '../getVenueIconSrc';

export type VaultData = Omit<
  VenusVault,
  'key' | 'category' | 'venue' | 'venueName' | 'venueIconSrc' | 'status' | 'vaultType'
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
    venueName: 'Venus',
    venueIconSrc: getVenueIconSrc('Venus'),
    status:
      vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade
        ? VaultStatus.Paused
        : VaultStatus.Active,
  };

  return venusVault;
};
