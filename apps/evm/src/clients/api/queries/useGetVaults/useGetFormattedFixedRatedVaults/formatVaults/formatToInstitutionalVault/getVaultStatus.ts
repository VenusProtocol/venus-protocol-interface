import type { LoanVaultDetail } from 'clients/api';
import { VaultStatus } from 'types';

/*
const VAULT_STATUS_MAPPING = {
  0: VaultStatus.Pending,
  1: VaultStatus.Pending,
  2: VaultStatus.Deposit,
  3: VaultStatus.Pending,
  4: VaultStatus.Earning,
  5: VaultStatus.Repaying,
  6: VaultStatus.Pending,
  7: VaultStatus.Claim,
  8: VaultStatus.Refund,
  9: VaultStatus.Paused,
  10: VaultStatus.Inactive,
};
*/

export const getVaultStatus = ({
  loanVaultDetail,
  nowMs,
}: {
  loanVaultDetail: LoanVaultDetail;
  nowMs: number;
}): VaultStatus => {
  const { vaultState, createdAt, openEndTime, lockEndTime } = loanVaultDetail ?? {};
  const createdAtMs = new Date(createdAt).getTime();
  const openEndMs = new Date(openEndTime).getTime();
  const lockEndMs = new Date(lockEndTime).getTime();

  if (vaultState === 0 || vaultState === 1) {
    return VaultStatus.Pending;
  }

  if (nowMs < createdAtMs) {
    return VaultStatus.Pending;
  }

  if (nowMs >= createdAtMs && nowMs < openEndMs) {
    return VaultStatus.Deposit;
  }

  if (nowMs >= openEndMs && nowMs < lockEndMs) {
    return VaultStatus.Earning;
  }

  if (nowMs >= lockEndMs && vaultState === 5) {
    return VaultStatus.Repaying;
  }

  if (nowMs >= lockEndMs && vaultState === 7) {
    return VaultStatus.Claim;
  }

  if (vaultState === 8) {
    return VaultStatus.Refund;
  }

  if (vaultState === 10) {
    return VaultStatus.Inactive;
  }

  return VaultStatus.Pending;
};
