import type { LoanVaultDetail } from 'clients/api';
import { VaultStatus } from 'types';
import { getVaultStatus } from '../getVaultStatus';

const baseLoanVaultDetail = {
  createdAt: '2025-01-01T00:00:00.000Z',
  openEndTime: '2025-02-01T00:00:00.000Z',
  lockEndTime: '2025-06-01T00:00:00.000Z',
  vaultState: 2,
} as LoanVaultDetail;

describe('getVaultStatus', () => {
  it('returns Pending when vaultState is 0', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: { ...baseLoanVaultDetail, vaultState: 0 },
        nowMs: new Date('2025-03-01').getTime(),
      }),
    ).toBe(VaultStatus.Pending);
  });

  it('returns Pending when vaultState is 1', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: { ...baseLoanVaultDetail, vaultState: 1 },
        nowMs: new Date('2025-03-01').getTime(),
      }),
    ).toBe(VaultStatus.Pending);
  });

  it('returns Pending when nowMs is before createdAt', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: baseLoanVaultDetail,
        nowMs: new Date('2024-12-01').getTime(),
      }),
    ).toBe(VaultStatus.Pending);
  });

  it('returns Deposit when nowMs is between createdAt and openEndTime', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: baseLoanVaultDetail,
        nowMs: new Date('2025-01-15').getTime(),
      }),
    ).toBe(VaultStatus.Deposit);
  });

  it('returns Earning when nowMs is between openEndTime and lockEndTime', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: baseLoanVaultDetail,
        nowMs: new Date('2025-03-01').getTime(),
      }),
    ).toBe(VaultStatus.Earning);
  });

  it('returns Repaying when nowMs is after lockEndTime and vaultState is 5', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: { ...baseLoanVaultDetail, vaultState: 5 },
        nowMs: new Date('2025-07-01').getTime(),
      }),
    ).toBe(VaultStatus.Repaying);
  });

  it('returns Claim when nowMs is after lockEndTime and vaultState is 7', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: { ...baseLoanVaultDetail, vaultState: 7 },
        nowMs: new Date('2025-07-01').getTime(),
      }),
    ).toBe(VaultStatus.Claim);
  });

  it('returns Refund when vaultState is 8', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: { ...baseLoanVaultDetail, vaultState: 8 },
        nowMs: new Date('2025-07-01').getTime(),
      }),
    ).toBe(VaultStatus.Refund);
  });

  it('returns Inactive when vaultState is 10', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: { ...baseLoanVaultDetail, vaultState: 10 },
        nowMs: new Date('2025-07-01').getTime(),
      }),
    ).toBe(VaultStatus.Inactive);
  });

  it('returns Pending as default for unhandled states', () => {
    expect(
      getVaultStatus({
        loanVaultDetail: { ...baseLoanVaultDetail, vaultState: 3 },
        nowMs: new Date('2025-07-01').getTime(),
      }),
    ).toBe(VaultStatus.Pending);
  });
});
