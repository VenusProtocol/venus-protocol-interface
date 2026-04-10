import { type PendleVault, type Vault, VaultType } from 'types';

export const isPendleVault = (vault: Vault): vault is PendleVault =>
  vault.vaultType === VaultType.Pendle;
