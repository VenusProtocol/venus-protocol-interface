import type { InstitutionalVault } from 'types';

import { VaultOverviewMarketInfo } from 'containers/VaultCard/VaultOverviewMarketInfo';
import { CampaignTimeline } from './CampaignTimeline';
import { StrategyDiagram } from './StrategyDiagram';
import { TotalDeposits } from './TotalDeposits';

export interface OverviewTabProps {
  vault: InstitutionalVault;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ vault }) => (
  <div className="flex flex-col gap-8 py-2">
    <TotalDeposits vault={vault} />

    <CampaignTimeline vault={vault} />

    <StrategyDiagram vault={vault} />

    <VaultOverviewMarketInfo
      vaultDeploymentDate={vault.vaultDeploymentDate}
      manager={vault.manager}
      managerIcon={vault.managerIcon}
      managerLink={vault.managerLink}
      copyAddress={vault.managerAddress}
    />
  </div>
);
