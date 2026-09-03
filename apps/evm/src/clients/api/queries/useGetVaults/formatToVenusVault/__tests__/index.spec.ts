import { vaults } from '__mocks__/models/vaults';
import { VaultStatus } from 'types';

import { type VaultData, formatToVenusVault } from '..';

const [vaiVault] = vaults;

const vaultData: VaultData = {
  rewardToken: vaiVault.rewardToken,
  stakedToken: vaiVault.stakedToken,
  isPaused: false,
  lockingPeriodMs: vaiVault.lockingPeriodMs,
  stakedTokenPriceCents: vaiVault.stakedTokenPriceCents,
  rewardTokenPriceCents: vaiVault.rewardTokenPriceCents,
  dailyEmissionMantissa: vaiVault.dailyEmissionMantissa,
  dailyEmissionCents: vaiVault.dailyEmissionCents,
  stakeBalanceMantissa: vaiVault.stakeBalanceMantissa,
  stakeBalanceCents: vaiVault.stakeBalanceCents,
  stakeAprPercentage: vaiVault.stakeAprPercentage,
};

describe('formatToVenusVault', () => {
  it('marks a depositable vault as being in the Deposit state', () => {
    const vault = formatToVenusVault(vaultData);

    expect(vault.status).toBe(VaultStatus.Deposit);
  });

  it('marks a paused vault as being in the Paused state', () => {
    const vault = formatToVenusVault({
      ...vaultData,
      isPaused: true,
    });

    expect(vault.status).toBe(VaultStatus.Paused);
  });

  it('marks a vault with pending withdrawals from before the upgrade as being in the Paused state', () => {
    const vault = formatToVenusVault({
      ...vaultData,
      userHasPendingWithdrawalsFromBeforeUpgrade: true,
    });

    expect(vault.status).toBe(VaultStatus.Paused);
  });
});
