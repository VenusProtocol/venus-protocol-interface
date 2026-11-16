import BigNumber from 'bignumber.js';
import type { Asset, LiquidityHub, VenusVault } from 'types';
import { getRankingApyPercentage } from '../getRankingApyPercentage';

export const getSupplyApyPercentage = (source: Asset | LiquidityHub | VenusVault) => {
  if ('stakeAprPercentage' in source) {
    return new BigNumber(source.stakeAprPercentage);
  }

  return getRankingApyPercentage({
    type: 'supply',
    baseApyPercentage: source.supplyApyPercentage,
    tokenDistributions: source.supplyTokenDistributions,
  });
};
