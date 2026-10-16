import type { LiquidityHubSource } from 'types';
import getCombinedApy from 'utilities/getCombinedApy';

// Sorted by the APY the user actually reads
export const getTotalSupplyApy = ({
  supplyApyPercentage,
  supplyTokenDistributions,
}: LiquidityHubSource) =>
  getCombinedApy({
    type: 'supply',
    baseApyPercentage: supplyApyPercentage,
    tokenDistributions: supplyTokenDistributions,
  }).totalApyPercentage;
