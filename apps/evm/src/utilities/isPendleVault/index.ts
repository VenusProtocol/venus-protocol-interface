import {
  type InstitutionalVault,
  type PendleVault,
  type Vault,
  VaultManager,
  type VenusVault,
} from 'types';

export const isVenusVault = (vault: Vault): vault is VenusVault =>
  vault.manager === VaultManager.Venus;

export const isPendleVault = (vault: Vault): vault is PendleVault =>
  vault.manager === VaultManager.Pendle;

export const isInstitutionalVault = (vault: Vault): vault is InstitutionalVault =>
  vault.manager === VaultManager.Ceefu;
