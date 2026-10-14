import type { LiquidityHubSource } from 'types';
import getCombinedApy from 'utilities/getCombinedApy';

// The APY cell renders the base APY plus its active reward distributions, so the column has to
// order sources by the same figure the user reads
export const getTotalSupplyApy = ({
  supplyApyPercentage,
  supplyTokenDistributions,
}: LiquidityHubSource) =>
  getCombinedApy({
    type: 'supply',
    baseApyPercentage: supplyApyPercentage,
    tokenDistributions: supplyTokenDistributions,
  }).totalApyPercentage;
