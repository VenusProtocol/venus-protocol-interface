import { type Vault, VaultType, type VenusVault } from 'types';

export const isVenusVault = (vault: Vault): vault is VenusVault =>
  vault.vaultType === VaultType.Venus;
