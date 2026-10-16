import { type Vault, VaultStatus } from 'types';
import { isInstitutionalVault } from 'utilities';

import { getClaimableSinceDate } from './getClaimableSinceDate';
import { userHasFunds } from './userHasFunds';

export const ARCHIVED_VAULT_MATURITY_PERIOD_MS = 90 * 24 * 60 * 60 * 1000;

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
