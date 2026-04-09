import type { Vault } from 'types';

import { isInstitutionalVault, isPendleVault } from 'utilities';
import { MarketInfo } from './MarketInfo';
import { StrategyDiagram } from './StrategyDiagram';
import { TotalDeposits } from './TotalDeposits';

export interface OverviewTabProps {
  vault: Vault;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ vault }) => {
  return (
    <div className="flex flex-col gap-8 py-2">
      {isPendleVault(vault) && <TotalDeposits vault={vault} />}

      <StrategyDiagram vault={vault} />

      {(isPendleVault(vault) || isInstitutionalVault(vault)) && <MarketInfo vault={vault} />}
    </div>
  );
};
