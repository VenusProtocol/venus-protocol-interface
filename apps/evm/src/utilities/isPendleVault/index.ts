import { type PendleVault, type Vault, VaultManager } from 'types';

export const isPendleVault = (vault: Vault): vault is PendleVault =>
  vault.manager === VaultManager.Pendle;
