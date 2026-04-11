import { type Vault, VaultManager, type VenusVault } from 'types';

export const isLegacyVenusVault = (vault: Vault): vault is VenusVault =>
  vault.manager === VaultManager.Venus;
