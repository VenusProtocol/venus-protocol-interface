import BigNumber from 'bignumber.js';

import { HEALTH_FACTOR_SAFE_MAX_THRESHOLD } from 'constants/healthFactor';
import type { Asset, Pool } from 'types';
import { clampToZero } from 'utilities/clampToZero';

export interface CalculateCollateralMigrationLimitsInput {
  asset: Asset;
  vhAsset: Asset;
  pool: Pool;
}

export interface CalculateCollateralMigrationLimitsOutput {
  limitTokens: BigNumber;
  safeLimitTokens: BigNumber;
}

export const calculateCollateralMigrationLimits = ({
  asset,
  vhAsset,
  pool,
}: CalculateCollateralMigrationLimitsInput): CalculateCollateralMigrationLimitsOutput => {
  const { decimals } = asset.vToken.underlyingToken;
  const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(asset.tokenPriceCents);
  const availableTokens = BigNumber.minimum(asset.userSupplyBalanceTokens, assetLiquidityTokens).dp(
    decimals,
    BigNumber.ROUND_DOWN,
  );

  if (!asset.isCollateralOfUser || !pool.userBorrowBalanceCents?.isGreaterThan(0)) {
    return {
      limitTokens: availableTokens,
      safeLimitTokens: availableTokens,
    };
  }

  const borrowLimitMarginCents = (pool.userBorrowLimitProtectedCents ?? new BigNumber(0)).minus(
    pool.userBorrowBalanceProtectedCents ?? 0,
  );
  const collateralFactorDrop = new BigNumber(asset.userCollateralFactor).minus(
    vhAsset.userCollateralFactor,
  );

  let limitTokens = borrowLimitMarginCents.isGreaterThan(0) ? availableTokens : new BigNumber(0);

  if (collateralFactorDrop.isGreaterThan(0)) {
    limitTokens = BigNumber.minimum(
      availableTokens,
      clampToZero({
        value: borrowLimitMarginCents
          .dividedBy(asset.tokenSupplyPriceCents)
          .dividedBy(collateralFactorDrop),
      }),
    ).dp(decimals, BigNumber.ROUND_DOWN);
  }

  const liquidationThresholdDrop = new BigNumber(asset.userLiquidationThresholdPercentage)
    .minus(vhAsset.userLiquidationThresholdPercentage)
    .dividedBy(100);

  if (liquidationThresholdDrop.isLessThanOrEqualTo(0)) {
    return {
      limitTokens,
      safeLimitTokens: limitTokens,
    };
  }

  const safeMarginTokens = clampToZero({
    value: (pool.userLiquidationThresholdCents ?? new BigNumber(0))
      .minus(pool.userBorrowBalanceCents.multipliedBy(HEALTH_FACTOR_SAFE_MAX_THRESHOLD))
      .dividedBy(asset.tokenPriceCents)
      .dividedBy(liquidationThresholdDrop),
  });

  return {
    limitTokens,
    safeLimitTokens: BigNumber.minimum(limitTokens, safeMarginTokens).dp(
      decimals,
      BigNumber.ROUND_DOWN,
    ),
  };
};
