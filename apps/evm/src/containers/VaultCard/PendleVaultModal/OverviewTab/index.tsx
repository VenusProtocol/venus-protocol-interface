import type { PendleVault } from 'types';

import { MarketInfo } from './MarketInfo';
import { StrategyDiagram } from './StrategyDiagram';
import { TotalDeposits } from './TotalDeposits';

export interface OverviewTabProps {
  vault: PendleVault;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ vault }) => {
  return (
    <div className="flex flex-col gap-8 py-2">
      <TotalDeposits vault={vault} />

      <StrategyDiagram vault={vault} />

      <MarketInfo vault={vault} />
    </div>
  );
};
