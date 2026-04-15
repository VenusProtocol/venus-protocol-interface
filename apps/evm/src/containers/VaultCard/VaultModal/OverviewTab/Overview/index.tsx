import type { PendleVault } from 'types';

import { PendleTotalDeposits } from './PendleTotalDeposits';

export interface OverviewProps {
  vault: PendleVault;
}

export const Overview: React.FC<OverviewProps> = ({ vault }) => {
  return <PendleTotalDeposits vault={vault} />;
};
