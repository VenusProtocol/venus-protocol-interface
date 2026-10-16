import { type Vault, VaultStatus } from 'types';
import { isInstitutionalVault, isPendleVault } from 'utilities';

export const getClaimableSinceDate = (vault: Vault) => {
  if (isInstitutionalVault(vault) && vault.status === VaultStatus.Claim) {
    return vault.settlementDate;
  }

  if (isInstitutionalVault(vault) && vault.status === VaultStatus.Refund) {
    return vault.openEndDate;
  }

  if (isPendleVault(vault) && vault.status === VaultStatus.Claim) {
    return vault.maturityDate;
  }

  return undefined;
};
