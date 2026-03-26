import type { AnyVault, PendleVault, VaultManager } from 'types';

export const isPendleVault = (vault: AnyVault): vault is PendleVault =>
  vault.manager === ('pendle' as VaultManager);
