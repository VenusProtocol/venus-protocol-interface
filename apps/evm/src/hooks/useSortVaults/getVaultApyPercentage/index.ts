import type { Vault } from 'types';
import { isInstitutionalVault } from 'utilities';

export const getVaultApyPercentage = ({ vault }: { vault: Vault }) =>
  isInstitutionalVault(vault) && vault.isSettled
    ? vault.realizedAprPercentage
    : vault.stakeAprPercentage;
