import { type InstitutionalVault, type Vault, VaultType } from 'types';

export const isInstitutionalVault = (vault: Vault): vault is InstitutionalVault =>
  vault.vaultType === VaultType.Institutional;
