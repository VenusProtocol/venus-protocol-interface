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
      contractAddress={vault.vaultAddress}
      venue={vault.venue}
      venueName={vault.venueName}
      venueIconSrc={vault.venueIconSrc}
      venueUrl={vault.venueUrl}
      copyAddress={vault.venueAddress}
      collateralToken={vault.collateralToken}
    />
  </div>
);
