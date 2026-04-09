import {
  type InstitutionalVault,
  type PendleVault,
  type Vault,
  VaultType,
  type VenusVault,
} from 'types';

export const isVenusVault = (vault: Vault): vault is VenusVault =>
  vault.vaultType === VaultType.Venus;

export const isPendleVault = (vault: Vault): vault is PendleVault =>
  vault.vaultType === VaultType.Pendle;

export const isInstitutionalVault = (vault: Vault): vault is InstitutionalVault =>
  vault.vaultType === VaultType.Institutional;
