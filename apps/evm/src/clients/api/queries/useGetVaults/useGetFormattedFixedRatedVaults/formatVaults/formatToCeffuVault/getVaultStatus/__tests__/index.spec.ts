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
  latePenaltyRateMantissa: '0',
  liquidationIncentiveMantissa: '0',
  liquidationThresholdMantissa: '0',
  liquidityMantissa: '0',
  lockEndTime: '2026-04-10T00:00:00.000Z',
  maxBorrowCapMantissa: '0',
  minBorrowCapMantissa: '0',
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
  nowMs = new Date('2026-04-01T00:00:00.000Z').getTime(),
}: {
  loanVaultDetail?: LoanVaultDetail;
  nowMs?: number;
}) =>
  getVaultStatus({
    loanVaultDetail,
    nowMs,
  });

describe('getVaultStatus', () => {
  describe('deposit state', () => {
    it('returns Deposit before the open window ends', () => {
      expect(
        getStatus({
          nowMs: new Date('2026-04-03T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Deposit);
    });

    it('returns Pending when the open window ends exactly', () => {
      expect(
        getStatus({
          nowMs: new Date(baseLoanVaultDetail.openEndTime).getTime(),
        }),
      ).toBe(VaultStatus.Pending);
    });

    it('returns Pending after the open window ends', () => {
      expect(
        getStatus({
          nowMs: new Date('2026-04-06T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Pending);
    });
  });

  describe('earning state', () => {
    const earningLoanVaultDetail = {
      ...baseLoanVaultDetail,
      vaultState: 4,
    } satisfies LoanVaultDetail;

    it('returns Earning before the lock ends', () => {
      expect(
        getStatus({
          loanVaultDetail: earningLoanVaultDetail,
          nowMs: new Date('2026-04-06T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Earning);
    });

    it('returns Pending when the lock end is reached exactly', () => {
      expect(
        getStatus({
          loanVaultDetail: earningLoanVaultDetail,
          nowMs: new Date(baseLoanVaultDetail.lockEndTime).getTime(),
        }),
      ).toBe(VaultStatus.Pending);
    });

    it('returns Pending after the lock ends', () => {
      expect(
        getStatus({
          loanVaultDetail: earningLoanVaultDetail,
          nowMs: new Date('2026-04-11T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Pending);
    });
  });

  describe('repaying state', () => {
    const repayingLoanVaultDetail = {
      ...baseLoanVaultDetail,
      vaultState: 5,
    } satisfies LoanVaultDetail;

    it('returns Repaying before the settlement deadline', () => {
      expect(
        getStatus({
          loanVaultDetail: repayingLoanVaultDetail,
          nowMs: new Date('2026-04-11T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Repaying);
    });

    it('returns Pending when the settlement deadline is reached exactly', () => {
      expect(
        getStatus({
          loanVaultDetail: repayingLoanVaultDetail,
          nowMs: new Date(baseLoanVaultDetail.settlementDeadline).getTime(),
        }),
      ).toBe(VaultStatus.Pending);
    });

    it('returns Pending after the settlement deadline', () => {
      expect(
        getStatus({
          loanVaultDetail: repayingLoanVaultDetail,
          nowMs: new Date('2026-04-13T00:00:00.000Z').getTime(),
        }),
      ).toBe(VaultStatus.Pending);
    });
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
  ])('returns $expectedStatus for vault state $vaultState', ({ vaultState, expectedStatus }) => {
    expect(
      getStatus({
        loanVaultDetail: {
          ...baseLoanVaultDetail,
          vaultState,
        },
      }),
    ).toBe(expectedStatus);
  });

  it('returns Pending for unhandled vault states', () => {
    expect(
      getStatus({
        loanVaultDetail: {
          ...baseLoanVaultDetail,
          vaultState: 6,
        },
      }),
    ).toBe(VaultStatus.Pending);
  });
});
