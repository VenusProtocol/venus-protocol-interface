import type { Vault } from 'types';

export const getVaultDeploymentTimestampMs = ({ vault }: { vault: Vault }) =>
  'vaultDeploymentDate' in vault && vault.vaultDeploymentDate
    ? vault.vaultDeploymentDate.getTime()
    : undefined;
