import BigNumber from 'bignumber.js';
import type { LoanVaultDetail } from 'clients/api';
import { VaultStatus } from 'types';

// Vault states:
// 0  WaitingForMargin
// 1  MarginDeposited
// 2  Fundraising
// 3  InstitutionConfirmation
// 4  Lock
// 5  PendingSettlement
// 6  SettlementDeadlineExceeded
// 7  Matured
// 8  Failed
// 9  Liquidated
// 10 Closed

export const getVaultStatus = ({
  loanVaultDetail,
  userRedeemLimitMantissa,
  nowMs,
}: {
  loanVaultDetail: LoanVaultDetail;
  userRedeemLimitMantissa?: BigNumber;
  nowMs: number;
}): VaultStatus => {
  const {
    vaultState,
    openEndTime,
    lockEndTime,
    totalRaisedMantissa,
    minBorrowCapMantissa,
    outstandingDebtMantissa,
  } = loanVaultDetail;
  const openEndMs = openEndTime ? new Date(openEndTime).getTime() : undefined;
  const lockEndMs = lockEndTime ? new Date(lockEndTime).getTime() : undefined;
  const hasReachedMinBorrowCap = new BigNumber(totalRaisedMantissa).gte(minBorrowCapMantissa);
  const hasOutstandingDebt = new BigNumber(outstandingDebtMantissa).gt(0);
  const userCanRedeem = !!userRedeemLimitMantissa?.gt(0);

  // Vault has not been opened for fundraising yet, so no user action is available
  if (!openEndMs) {
    return VaultStatus.Pending;
  }

  // Vault has been liquidated, so users can only withdraw the recovered assets
  if (vaultState === 9) {
    return VaultStatus.Liquidated;
  }

  // Vault has been closed by governance and should not accept any user action
  if (vaultState === 10) {
    return VaultStatus.Inactive;
  }

  // Vault has already failed onchain, so users can immediately claim a refund
  if (vaultState === 8) {
    return VaultStatus.Refund;
  }

  // Vault has fully matured onchain, so users can redeem their position immediately
  if (vaultState === 7) {
    return VaultStatus.Claim;
  }

  // Vault missed the settlement deadline: users can claim if debt is cleared, otherwise repayment
  // is still pending
  if (vaultState === 6) {
    return hasOutstandingDebt && !userCanRedeem ? VaultStatus.Repaying : VaultStatus.Claim;
  }

  // Vault reached pending settlement: users can claim if debt is cleared, otherwise repayment is
  // still pending
  if (vaultState === 5) {
    return hasOutstandingDebt && !userCanRedeem ? VaultStatus.Repaying : VaultStatus.Claim;
  }

  // Vault is locked and still before maturity
  if (vaultState === 4 && lockEndMs && nowMs < lockEndMs) {
    return VaultStatus.Locked;
  }

  // Vault is locked but the lock period has ended: users can claim if debt is cleared, otherwise
  // repayment is pending
  if (vaultState === 4) {
    return hasOutstandingDebt && !userCanRedeem ? VaultStatus.Repaying : VaultStatus.Claim;
  }

  // Vault is still fundraising and the deposit window is open
  if (vaultState === 2 && nowMs < openEndMs) {
    return VaultStatus.Deposit;
  }

  // Vault is stale in fundraising after the deposit window, and the next user tx would push it into
  // Failed
  if (vaultState === 2 && !hasReachedMinBorrowCap) {
    return VaultStatus.Refund;
  }

  // Vault is stale in fundraising after a successful raise, but it still must advance onchain
  // before users can claim
  if (vaultState === 2) {
    return VaultStatus.Pending;
  }

  // Vault is in a pre-action or unmapped state, so keep the frontend non-actionable
  return VaultStatus.Pending;
};
