import { type AnyVault, type PendleVault, VaultManager } from 'types';

export const isPendleVault = (vault: AnyVault): vault is PendleVault =>
  vault.manager === VaultManager.Pendle;
