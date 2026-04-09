import type { Vault } from 'types';

import { isInstitutionalVault, isPendleVault } from 'utilities';
import { CampaignTimeline } from './Institutional/CampaignTimeline';
import { TotalDeposits } from './Institutional/TotalDeposits';
import { PendleTotalDeposits } from './PendleTotalDeposits';

export interface OverviewProps {
  vault: Vault;
}

export const Overview: React.FC<OverviewProps> = ({ vault }) => {
  if (isPendleVault(vault)) {
    return <PendleTotalDeposits vault={vault} />;
  }

  if (isInstitutionalVault(vault)) {
    return (
      <>
        <TotalDeposits vault={vault} />
        <CampaignTimeline vault={vault} />
      </>
    );
  }

  return null;
};
