import type { InstitutionalVault, PendleVault } from 'types';

import { isInstitutionalVault, isPendleVault } from '../../utils';
import { MarketInfo } from './MarketInfo';
import { Overview } from './Overview';
import { StrategyDiagram } from './StrategyDiagram';

export interface OverviewTabProps {
  vault: PendleVault | InstitutionalVault;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ vault }) => {
  return (
    <div className="flex flex-col gap-8 py-2">
      <Overview vault={vault} />

      <StrategyDiagram vault={vault} />

      {(isPendleVault(vault) || isInstitutionalVault(vault)) && <MarketInfo vault={vault} />}
    </div>
  );
};
