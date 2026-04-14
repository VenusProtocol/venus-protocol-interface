import type { InstitutionalVault } from 'types';

export const getCurrentStatusIndex = (vault: InstitutionalVault, nowMs: number): number => {
  const hasPendingPeriod = vault.vaultDeploymentDate?.getTime() === vault.openEndDate?.getTime();
  // When the Pending step is present, indices 2+ shift by 1
  const offset = hasPendingPeriod ? 1 : 0;

  // Claim: after settlement date
  if (vault.settlementDate && nowMs >= vault.settlementDate.getTime()) {
    return 3 + offset;
  }

  // Repaying: after maturity date
  if (vault.maturityDate && nowMs >= vault.maturityDate.getTime()) {
    return 2 + offset;
  }

  // Earning or Pending: after open end date
  if (vault.openEndDate && nowMs >= vault.openEndDate.getTime()) {
    if (hasPendingPeriod && vault.lockEndDate && nowMs < vault.lockEndDate.getTime()) {
      return 1; // Pending
    }

    return 1 + offset; // Earning
  }

  // Deposit: default (before open end date)
  return 0;
};
