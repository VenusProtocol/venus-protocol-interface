import BigNumber from 'bignumber.js';

import type { LiquidityHub, Pool, TokenDistribution } from 'types';
import areTokensEqual from 'utilities/areTokensEqual';

export const appendCorePrimeDistributionsToLiquidityHub = ({
  liquidityHub,
  corePool,
}: {
  liquidityHub: LiquidityHub;
  corePool: Pool;
}): LiquidityHub => {
  const vhAsset = corePool.assets.find(asset =>
    areTokensEqual(asset.vToken.underlyingToken, liquidityHub.vhToken),
  );

  if (!vhAsset) {
    return liquidityHub;
  }

  const coreVhTokens = vhAsset.userSupplyBalanceTokens;
  const totalVhTokens = coreVhTokens.plus(liquidityHub.userVhTokenBalanceTokens ?? 0);
  const coreShare = totalVhTokens.isGreaterThan(0)
    ? coreVhTokens.dividedBy(totalVhTokens)
    : new BigNumber(0);

  const primeDistributions = vhAsset.supplyTokenDistributions.reduce<TokenDistribution[]>(
    (acc, distribution) => {
      if (distribution.type === 'primeSimulation') {
        return [
          ...acc,
          {
            ...distribution,
            referenceValues: {
              ...distribution.referenceValues,
              userSupplyBalanceTokens: distribution.referenceValues.userSupplyBalanceTokens
                .multipliedBy(liquidityHub.pricePerShare)
                .dp(liquidityHub.vhToken.underlyingToken.decimals),
            },
          },
        ];
      }

      if (distribution.type === 'prime') {
        return [
          ...acc,
          {
            ...distribution,
            apyPercentage: distribution.apyPercentage.multipliedBy(coreShare),
          },
        ];
      }

      return acc;
    },
    [],
  );

  if (primeDistributions.length === 0) {
    return liquidityHub;
  }

  return {
    ...liquidityHub,
    supplyTokenDistributions: [...liquidityHub.supplyTokenDistributions, ...primeDistributions],
  };
};
