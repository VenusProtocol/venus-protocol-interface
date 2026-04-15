import type { FC } from 'react';
import type { Vault } from 'types';
import { PendleVaultCard } from './Pendle';
import { VenusVaultCard } from './Venus';
import { isPendleVault } from './utils';

export interface VaultCardProps {
  vault: Vault;
}

export const VaultCard: FC<VaultCardProps> = ({ vault }) => {
  if (isPendleVault(vault)) {
    return <PendleVaultCard vault={vault} />;
  }

  return <VenusVaultCard vault={vault} />;
};
