import BigNumber from 'bignumber.js';
import type { Asset, LiquidityHub, VenusVault } from 'types';
import getCombinedApy from 'utilities/getCombinedApy';

export const getSupplyApyPercentage = (source: Asset | LiquidityHub | VenusVault) => {
  if ('stakeAprPercentage' in source) {
    return new BigNumber(source.stakeAprPercentage);
  }

  return getCombinedApy({
    type: 'supply',
    baseApyPercentage: source.supplyApyPercentage,
    tokenDistributions: source.supplyTokenDistributions,
  }).totalApyPercentage;
};
