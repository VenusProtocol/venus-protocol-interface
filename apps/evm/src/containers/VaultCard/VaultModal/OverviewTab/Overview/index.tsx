import type { InstitutionalVault, PendleVault } from 'types';

import { isInstitutionalVault, isPendleVault } from '../../../utils';
import { CampaignTimeline } from './Institutional/CampaignTimeline';
import { TotalDeposits } from './Institutional/TotalDeposits';
import { PendleTotalDeposits } from './PendleTotalDeposits';

export interface OverviewProps {
  vault: PendleVault | InstitutionalVault;
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
