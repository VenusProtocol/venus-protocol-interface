import BigNumber from 'bignumber.js';

import type { BalanceMutation, LiquidityHub, Pool, TokenDistribution } from 'types';
import { appendCorePrimeDistributionsToLiquidityHub } from 'utilities/appendCorePrimeDistributionsToLiquidityHub';
import areAddressesEqual from 'utilities/areAddressesEqual';
import areTokensEqual from 'utilities/areTokensEqual';

const isPrimeDistribution = (distribution: TokenDistribution) =>
  distribution.type === 'prime' || distribution.type === 'primeSimulation';

export const getSimulatedLiquidityHubTokenDistributions = ({
  liquidityHub,
  corePool,
  simulatedCorePool,
  balanceMutations,
}: {
  liquidityHub: LiquidityHub;
  corePool?: Pool;
  simulatedCorePool?: Pool;
  balanceMutations: BalanceMutation[];
}): TokenDistribution[] | undefined => {
  const hubBalanceMutations = balanceMutations.filter(
    balanceMutation =>
      balanceMutation.type === 'liquidityHub' &&
      areAddressesEqual(balanceMutation.vhTokenAddress, liquidityHub.vhToken.address) &&
      !balanceMutation.amountTokens.isZero(),
  );

  if (
    !corePool ||
    hubBalanceMutations.length === 0 ||
    !liquidityHub.supplyTokenDistributions.some(isPrimeDistribution) ||
    liquidityHub.pricePerShare.isZero()
  ) {
    return undefined;
  }

  const resultingCorePool = simulatedCorePool ?? corePool;

  const findVhAsset = (pool: Pool) =>
    pool.assets.find(asset => areTokensEqual(asset.vToken.underlyingToken, liquidityHub.vhToken));

  const vhAsset = findVhAsset(corePool);
  const resultingVhAsset = findVhAsset(resultingCorePool);

  if (!vhAsset || !resultingVhAsset) {
    return undefined;
  }

  // Withdrawals burn extra shares to cover the redeem fee
  const redeemPricePerShare = liquidityHub.pricePerShare.multipliedBy(
    new BigNumber(1).minus(liquidityHub.redeemFeePercentage.dividedBy(100)),
  );

  const hubVhTokenDelta = hubBalanceMutations.reduce(
    (acc, balanceMutation) =>
      balanceMutation.action === 'supply'
        ? acc.plus(balanceMutation.amountTokens.dividedBy(liquidityHub.pricePerShare))
        : acc.minus(balanceMutation.amountTokens.dividedBy(redeemPricePerShare)),
    new BigNumber(0),
  );

  const coreVhTokenDelta = resultingVhAsset.userSupplyBalanceTokens.minus(
    vhAsset.userSupplyBalanceTokens,
  );

  const walletVhTokens = BigNumber.max(
    (liquidityHub.userVhTokenBalanceTokens ?? new BigNumber(0))
      .plus(hubVhTokenDelta)
      .minus(coreVhTokenDelta),
    0,
  );

  return appendCorePrimeDistributionsToLiquidityHub({
    liquidityHub: {
      ...liquidityHub,
      userVhTokenBalanceTokens: walletVhTokens,
      supplyTokenDistributions: liquidityHub.supplyTokenDistributions.filter(
        distribution => !isPrimeDistribution(distribution),
      ),
    },
    corePool: resultingCorePool,
  }).supplyTokenDistributions;
};
