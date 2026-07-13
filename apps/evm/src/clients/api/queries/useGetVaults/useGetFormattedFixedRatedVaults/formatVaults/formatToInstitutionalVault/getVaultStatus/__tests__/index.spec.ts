import BigNumber from 'bignumber.js';
import { VaultStatus } from 'types';

import type { LoanVaultDetail } from 'clients/api/queries/getFixedRatedVaults/types';
import { getVaultStatus } from '..';

const baseLoanVaultDetail: LoanVaultDetail = {
  chainId: '97',
  collateralAssetAddress: '0x1111111111111111111111111111111111111111',
  collateralValueCents: '0',
  createdAt: '2026-04-01T00:00:00.000Z',
  debtValueCents: '0',
  fixedRateVaultId: 'vault-1',
  id: 'detail-1',
  institutionAddress: '0x2222222222222222222222222222222222222222',
  institutionName: 'Matrixdock',
  latePenaltyRateMantissa: '0',
  liquidationIncentiveMantissa: '0',
  liquidationThresholdMantissa: '0',
  liquidityMantissa: '0',
  openStartTime: '2026-04-07T00:00:00.000Z',
  lockEndTime: '2026-04-10T00:00:00.000Z',
  maxBorrowCapMantissa: '0',
  minBorrowCapMantissa: '100',
  minSupplierDepositMantissa: '10',
  openEndTime: '2026-04-05T00:00:00.000Z',
  outstandingDebtMantissa: '0',
  reserveFactorMantissa: '0',
  settlementDeadline: '2026-04-12T00:00:00.000Z',
  shortfallMantissa: '0',
  supplyAssetAddress: '0x3333333333333333333333333333333333333333',
  totalOwedMantissa: '0',
  totalRaisedMantissa: '0',
  updatedAt: '2026-04-01T00:00:00.000Z',
  vaultState: 2,
};

const getStatus = ({
  loanVaultDetail = baseLoanVaultDetail,
  userRedeemLimitMantissa,
  nowMs = new Date('2026-04-01T00:00:00.000Z').getTime(),
}: {
  loanVaultDetail?: LoanVaultDetail;
  userRedeemLimitMantissa?: BigNumber;
  nowMs?: number;
}) =>
  getVaultStatus({
    loanVaultDetail,
    userRedeemLimitMantissa,
    nowMs,
  });

describe('getVaultStatus', () => {
  it('returns Pending when the vault is missing an open end time', () => {
    expect(
      getStatus({
        loanVaultDetail: {
          ...baseLoanVaultDetail,
          openEndTime: undefined,
        } as unknown as LoanVaultDetail,
      }),
    ).toBe(VaultStatus.Pending);
  });

  it.each([
    {
      vaultState: 7,
      expectedStatus: VaultStatus.Claim,
    },
    {
      vaultState: 8,
      expectedStatus: VaultStatus.Refund,
    },
    {
      vaultState: 9,
      expectedStatus: VaultStatus.Liquidated,
    },
    {
      vaultState: 10,
      expectedStatus: VaultStatus.Inactive,
    },
  ])(
    'returns $expectedStatus for terminal vault state $vaultState before evaluating time-based status',
    ({ vaultState, expectedStatus }) => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            totalRaisedMantissa: '100',
            vaultState,
          },
          nowMs: new Date('2026-04-13T00:00:00.000Z').getTime(),
        }),
      ).toBe(expectedStatus);
    },
  );

  describe('fundraising', () => {
    it('returns Deposit when the vault is still accepting deposits', () => {
      expect(
        getStatus({
          nowMs: new Date('2026-04-03T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Deposit);
    });

    it('returns Refund when the fundraising window has ended below the minimum raise', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            totalRaisedMantissa: '99',
          },
          nowMs: new Date('2026-04-06T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Refund);
    });

    it('returns Pending when fundraising has ended successfully but the vault is still stale onchain', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            totalRaisedMantissa: '100',
          },
          nowMs: new Date('2026-04-06T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Pending);
    });

    it('does not return Claim for a stale fundraising vault even after lock end and with no debt', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '0',
          },
          nowMs: new Date('2026-04-11T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Pending);
    });
  });

  describe('lock', () => {
    it('returns Locked when the lock period is ongoing', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 4,
            totalRaisedMantissa: '100',
          },
          nowMs: new Date('2026-04-06T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Locked);
    });

    it('returns Claim when the vault is locked without a lock end time and no debt remains', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 4,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '0',
            lockEndTime: undefined,
          } as unknown as LoanVaultDetail,
          nowMs: new Date('2026-04-06T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Claim);
    });

    it('returns Claim at the lock end timestamp when there is no outstanding debt', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 4,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '0',
          },
          nowMs: new Date(baseLoanVaultDetail.lockEndTime).getTime(),
        }),
      ).toBe(VaultStatus.Claim);
    });

    it('returns Repaying after lock end when debt remains', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 4,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '1',
          },
          nowMs: new Date('2026-04-11T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Repaying);
    });

    it('returns Claim after lock end when debt remains but the connected user can redeem', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 4,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '1',
          },
          userRedeemLimitMantissa: new BigNumber('1'),
          nowMs: new Date('2026-04-11T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Claim);
    });
  });

  describe('pending settlement', () => {
    it('returns Claim when no debt remains', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 5,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '0',
          },
          nowMs: new Date('2026-04-11T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Claim);
    });

    it('returns Repaying when debt remains', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 5,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '1',
          },
          nowMs: new Date('2026-04-11T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Repaying);
    });

    it('returns Claim when debt remains but the connected user can redeem', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 5,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '1',
          },
          userRedeemLimitMantissa: new BigNumber('1'),
          nowMs: new Date('2026-04-11T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Claim);
    });
  });

  describe('settlement deadline exceeded', () => {
    it('returns Claim when no debt remains', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 6,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '0',
          },
          nowMs: new Date('2026-04-13T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Claim);
    });

    it('returns Repaying when debt remains', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 6,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '1',
          },
          nowMs: new Date('2026-04-13T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Repaying);
    });

    it('returns Claim when debt remains but the connected user can redeem', () => {
      expect(
        getStatus({
          loanVaultDetail: {
            ...baseLoanVaultDetail,
            vaultState: 6,
            totalRaisedMantissa: '100',
            outstandingDebtMantissa: '1',
          },
          userRedeemLimitMantissa: new BigNumber('1'),
          nowMs: new Date('2026-04-13T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Claim);
    });
  });

  it('returns Pending for unmatched states and timestamps', () => {
    expect(
      getStatus({
        loanVaultDetail: {
          ...baseLoanVaultDetail,
          vaultState: 1,
        },
        nowMs: new Date('2026-04-03T00:00:00.000Z').getTime(),
      }),
    ).toBe(VaultStatus.Pending);
  });
});
