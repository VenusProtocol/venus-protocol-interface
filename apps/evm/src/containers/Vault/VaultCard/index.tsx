import type { FC } from 'react';
import type { Vault } from 'types';
import { isInstitutionalVault, isPendleVault } from 'utilities';
import { InstitutionalVaultCard } from './Institutional';
import { VaultCardLegacy } from './Legacy';
import { PendleVaultCard } from './Pendle';

export interface VaultCardProps {
  vault: Vault;
}

export const VaultCard: FC<VaultCardProps> = ({ vault }) => {
  if (isInstitutionalVault(vault)) {
    return <InstitutionalVaultCard vault={vault} />;
  }

  if (isPendleVault(vault)) {
    return <PendleVaultCard vault={vault} />;
  }

  return <VaultCardLegacy vault={vault} />;
};
