import type { PendleVault } from 'types';

import { MarketInfo } from './MarketInfo';
import { Overview } from './Overview';
import { StrategyDiagram } from './StrategyDiagram';

export interface OverviewTabProps {
  vault: PendleVault;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ vault }) => {
  return (
    <div className="flex flex-col gap-8 py-2">
      <Overview vault={vault} />

      <StrategyDiagram vault={vault} />

      <MarketInfo vault={vault} />
    </div>
  );
};
