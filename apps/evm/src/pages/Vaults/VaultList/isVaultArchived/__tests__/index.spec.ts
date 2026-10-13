import BigNumber from 'bignumber.js';

import { institutionalVault, pendleVault, vaults } from '__mocks__/models/vaults';
import { type InstitutionalVault, type PendleVault, VaultStatus } from 'types';

import { ARCHIVED_VAULT_MATURITY_PERIOD_MS, isVaultArchived } from '..';

const nowMs = new Date('2026-10-13T00:00:00.000Z').getTime();
const exactlyNinetyDaysAgo = new Date(nowMs - ARCHIVED_VAULT_MATURITY_PERIOD_MS);
const overNinetyDaysAgo = new Date(nowMs - ARCHIVED_VAULT_MATURITY_PERIOD_MS - 1000);

const fakeInstitutionalVault: InstitutionalVault = {
  ...institutionalVault,
  userStakeBalanceMantissa: new BigNumber(0),
  userRedeemLimitMantissa: new BigNumber(0),
  userWithdrawLimitMantissa: new BigNumber(0),
};

const fakePendleVault: PendleVault = {
  ...pendleVault,
  userStakeBalanceMantissa: new BigNumber(0),
};

describe('isVaultArchived', () => {
  it.each([
    ['Claim', VaultStatus.Claim, { settlementDate: overNinetyDaysAgo }],
    ['Refund', VaultStatus.Refund, { openEndDate: overNinetyDaysAgo }],
  ])(
    'archives an institutional vault that entered %s more than 90 days ago',
    (_, status, dates) => {
      expect(
        isVaultArchived({ vault: { ...fakeInstitutionalVault, status, ...dates }, nowMs }),
      ).toBe(true);
    },
  );

  it.each([
    ['Claim', VaultStatus.Claim, { settlementDate: exactlyNinetyDaysAgo }],
    ['Refund', VaultStatus.Refund, { openEndDate: exactlyNinetyDaysAgo }],
  ])('keeps an institutional vault that entered %s exactly 90 days ago', (_, status, dates) => {
    expect(isVaultArchived({ vault: { ...fakeInstitutionalVault, status, ...dates }, nowMs })).toBe(
      false,
    );
  });

  it('judges an institutional Claim vault by its settlement date, not its maturity date', () => {
    expect(
      isVaultArchived({
        vault: {
          ...fakeInstitutionalVault,
          status: VaultStatus.Claim,
          maturityDate: overNinetyDaysAgo,
          settlementDate: exactlyNinetyDaysAgo,
        },
        nowMs,
      }),
    ).toBe(false);
  });

  it('archives an inactive institutional vault whatever its dates', () => {
    expect(
      isVaultArchived({
        vault: { ...fakeInstitutionalVault, status: VaultStatus.Inactive },
        nowMs,
      }),
    ).toBe(true);
  });

  it.each([
    VaultStatus.Deposit,
    VaultStatus.Locked,
    VaultStatus.Pending,
    VaultStatus.Repaying,
    VaultStatus.Liquidated,
  ])('never archives an institutional vault with status %s', status => {
    expect(
      isVaultArchived({
        vault: {
          ...fakeInstitutionalVault,
          status,
          openEndDate: overNinetyDaysAgo,
          settlementDate: overNinetyDaysAgo,
        },
        nowMs,
      }),
    ).toBe(false);
  });

  it('keeps a matured vault when its date is missing', () => {
    expect(
      isVaultArchived({
        vault: { ...fakeInstitutionalVault, status: VaultStatus.Claim, settlementDate: undefined },
        nowMs,
      }),
    ).toBe(false);
  });

  it('archives a Pendle vault that matured more than 90 days ago', () => {
    expect(
      isVaultArchived({
        vault: { ...fakePendleVault, status: VaultStatus.Claim, maturityDate: overNinetyDaysAgo },
        nowMs,
      }),
    ).toBe(true);
  });

  it('keeps a Pendle vault that matured exactly 90 days ago', () => {
    expect(
      isVaultArchived({
        vault: {
          ...fakePendleVault,
          status: VaultStatus.Claim,
          maturityDate: exactlyNinetyDaysAgo,
        },
        nowMs,
      }),
    ).toBe(false);
  });

  it('never archives a Venus vault', () => {
    vaults.forEach(vault => {
      expect(
        isVaultArchived({
          vault: { ...vault, status: VaultStatus.Paused, userStakeBalanceMantissa: undefined },
          nowMs,
        }),
      ).toBe(false);
    });
  });

  it.each([
    ['a stake balance', { userStakeBalanceMantissa: new BigNumber(1) }],
    ['a redeem limit', { userRedeemLimitMantissa: new BigNumber(1) }],
    ['a withdraw limit', { userWithdrawLimitMantissa: new BigNumber(1) }],
  ])('keeps an archivable vault the user still has %s in', (_, userFunds) => {
    expect(
      isVaultArchived({
        vault: { ...fakeInstitutionalVault, status: VaultStatus.Inactive, ...userFunds },
        nowMs,
      }),
    ).toBe(false);
  });

  it('keeps a matured Pendle vault the user still has a stake in', () => {
    expect(
      isVaultArchived({
        vault: {
          ...fakePendleVault,
          status: VaultStatus.Claim,
          maturityDate: overNinetyDaysAgo,
          userStakeBalanceMantissa: new BigNumber(1),
        },
        nowMs,
      }),
    ).toBe(false);
  });
});
