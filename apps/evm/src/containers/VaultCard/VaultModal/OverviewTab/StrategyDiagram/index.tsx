import type { FC } from 'react';
import type { PendleVault } from 'types';
import { isPendleVault } from '../../../utils';

import { PendleDiagram } from './PendleDiagram';

interface StrategyDiagramProps {
  vault: PendleVault;
}

export const StrategyDiagram: FC<StrategyDiagramProps> = ({ vault }) => {
  if (isPendleVault(vault)) {
    return <PendleDiagram vault={vault} />;
  }

  return null;
};
