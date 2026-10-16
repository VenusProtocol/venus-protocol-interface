import { type Vault, VaultStatus } from 'types';
import { isInstitutionalVault, isPendleVault } from 'utilities';

export const ARCHIVED_VAULT_MATURITY_PERIOD_MS = 90 * 24 * 60 * 60 * 1000;

const getClaimableSinceDate = (vault: Vault) => {
  if (isInstitutionalVault(vault)) {
    if (vault.status === VaultStatus.Claim) {
      return vault.settlementDate;
    }

    if (vault.status === VaultStatus.Refund) {
      return vault.openEndDate;
    }
  }

  if (isPendleVault(vault) && vault.status === VaultStatus.Claim) {
    return vault.maturityDate;
  }

  return undefined;
};

const userHasFunds = (vault: Vault) =>
  !!vault.userStakeBalanceMantissa?.gt(0) ||
  (isInstitutionalVault(vault) &&
    (vault.userRedeemLimitMantissa.gt(0) || vault.userWithdrawLimitMantissa.gt(0)));

export const isVaultArchived = ({
  vault,
  nowMs,
  isUserDataUnavailable = false,
}: {
  vault: Vault;
  nowMs: number;
  isUserDataUnavailable?: boolean;
}) => {
  if (userHasFunds(vault) || (isUserDataUnavailable && isInstitutionalVault(vault))) {
    return false;
  }

  if (isInstitutionalVault(vault) && vault.status === VaultStatus.Inactive) {
    return true;
  }

  const claimableSinceDate = getClaimableSinceDate(vault);

  return (
    !!claimableSinceDate && claimableSinceDate.getTime() < nowMs - ARCHIVED_VAULT_MATURITY_PERIOD_MS
  );
};
