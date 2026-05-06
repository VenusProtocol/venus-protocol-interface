import type { LoanVaultDetail } from 'clients/api';
import { VaultStatus } from 'types';

export const getVaultStatus = ({
  loanVaultDetail,
  nowMs,
}: {
  loanVaultDetail: LoanVaultDetail;
  nowMs: number;
}): VaultStatus => {
  const { vaultState, openEndTime, lockEndTime, settlementDeadline } = loanVaultDetail;
  const openEndMs = new Date(openEndTime).getTime();
  const lockEndMs = new Date(lockEndTime).getTime();
  const settlementDeadlineMs = new Date(settlementDeadline).getTime();

  if (vaultState === 2 && nowMs < openEndMs) {
    return VaultStatus.Deposit;
  }

  if (vaultState === 4 && nowMs < lockEndMs) {
    return VaultStatus.Earning;
  }

  if (vaultState === 5 && nowMs < settlementDeadlineMs) {
    return VaultStatus.Repaying;
  }

  if (vaultState === 7) {
    return VaultStatus.Claim;
  }

  if (vaultState === 8) {
    return VaultStatus.Refund;
  }

  if (vaultState === 9) {
    return VaultStatus.Liquidated;
  }

  if (vaultState === 10) {
    return VaultStatus.Inactive;
  }

  return VaultStatus.Pending;
};
