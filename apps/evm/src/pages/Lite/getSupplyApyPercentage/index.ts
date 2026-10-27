import type { Asset, LiquidityHub } from 'types';
import getCombinedApy from 'utilities/getCombinedApy';

export const getSupplyApyPercentage = (source: Asset | LiquidityHub) =>
  getCombinedApy({
    type: 'supply',
    baseApyPercentage: source.supplyApyPercentage,
    tokenDistributions: source.supplyTokenDistributions,
  }).totalApyPercentage;
