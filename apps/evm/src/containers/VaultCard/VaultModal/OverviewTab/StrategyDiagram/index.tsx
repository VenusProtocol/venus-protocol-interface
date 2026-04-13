import type { FC } from 'react';
import type { InstitutionalVault, PendleVault } from 'types';
import { isInstitutionalVault, isPendleVault } from '../../../utils';
import { InstitutionalDiagram } from './InstitutionalDiagram';
import { PendleDiagram } from './PendleDiagram';

interface StrategyDiagramProps {
  vault: PendleVault | InstitutionalVault;
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
