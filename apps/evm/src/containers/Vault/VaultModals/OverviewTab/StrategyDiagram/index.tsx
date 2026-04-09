import type { FC } from 'react';
import type { Vault } from 'types';
import { isInstitutionalVault, isPendleVault } from 'utilities';
import { InstitutionalDiagram } from './InstitutionalDiagram';
import { PendleDiagram } from './PendleDiagram';

interface StrategyDiagramProps {
  vault: Vault;
}

export const StrategyDiagram: FC<StrategyDiagramProps> = ({ vault }) => {
  if (isPendleVault(vault)) {
    return <PendleDiagram vault={vault} />;
  }

  if (isInstitutionalVault(vault)) {
    return <InstitutionalDiagram vault={vault} />;
  }

  return null;
};
