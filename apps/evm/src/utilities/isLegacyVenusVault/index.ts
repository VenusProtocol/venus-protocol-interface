import { type Vault, VaultType, type VenusVault } from 'types';

export const isLegacyVenusVault = (vault: Vault): vault is VenusVault =>
  vault.vaultType === VaultType.Venus;
