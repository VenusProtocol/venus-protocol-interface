import BigNumber from 'bignumber.js';
import type { Asset, LiquidityHub, VenusVault } from 'types';
import { getBestDistributionApys } from 'utilities';
import getCombinedApy from 'utilities/getCombinedApy';

export const getSupplyApyPercentage = (source: Asset | LiquidityHub | VenusVault) => {
  if ('stakeAprPercentage' in source) {
    return new BigNumber(source.stakeAprPercentage);
  }

  if ('vToken' in source) {
    return getBestDistributionApys({ asset: source }).totalSupplyApyPercentage;
  }

  const { totalApyPercentage, apyPrimePercentage, apyPrimeSimulationPercentage } = getCombinedApy({
    type: 'supply',
    baseApyPercentage: source.supplyApyPercentage,
    tokenDistributions: source.supplyTokenDistributions,
  });

  return apyPrimePercentage.isGreaterThan(0)
    ? totalApyPercentage
    : totalApyPercentage.plus(apyPrimeSimulationPercentage);
};
