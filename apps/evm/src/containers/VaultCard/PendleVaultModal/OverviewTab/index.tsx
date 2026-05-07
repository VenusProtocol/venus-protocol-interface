import type { PendleVault } from 'types';

import { VaultOverviewMarketInfo } from 'containers/VaultCard/VaultOverviewMarketInfo';
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

      <VaultOverviewMarketInfo
        vaultDeploymentDate={vault.vaultDeploymentDate}
        manager={vault.manager}
        managerIcon={vault.managerIcon}
        managerLink={vault.managerLink}
        copyAddress={vault.asset?.vToken?.underlyingToken?.address}
      />
    </div>
  );
};
