import BigNumber from 'bignumber.js';

import {
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_MAX_THRESHOLD,
} from 'constants/healthFactor';
import type { Asset, Pool } from 'types';
import { clampToZero } from 'utilities/clampToZero';

export interface CalculateCollateralWithdrawLimitsInput {
  asset: Asset;
  pool: Pool;
}

export interface CalculateCollateralWithdrawLimitsOutput {
  limitTokens: BigNumber;
  safeLimitTokens: BigNumber;
  moderateRiskMaxTokens: BigNumber;
}

export const calculateCollateralWithdrawLimits = ({
  asset,
  pool,
}: CalculateCollateralWithdrawLimitsInput): CalculateCollateralWithdrawLimitsOutput => {
  const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(asset.tokenPriceCents);
  const availableTokens = BigNumber.minimum(asset.userSupplyBalanceTokens, assetLiquidityTokens);
  const isAssetCollateralizable =
    asset.userCollateralFactor > 0 && asset.userLiquidationThresholdPercentage > 0;

  if (
    !asset.isCollateralOfUser ||
    !isAssetCollateralizable ||
    !pool.userBorrowLimitCents ||
    !pool.userLiquidationThresholdCents ||
    !pool.userBorrowBalanceCents ||
    pool.userBorrowBalanceCents.isEqualTo(0)
  ) {
    return {
      limitTokens: availableTokens,
      safeLimitTokens: availableTokens,
      moderateRiskMaxTokens: availableTokens,
    };
  }

  if (
    pool.userBorrowBalanceProtectedCents?.isGreaterThanOrEqualTo(
      pool.userBorrowLimitProtectedCents ?? 0,
    )
  ) {
    const zero = new BigNumber(0);

    return {
      limitTokens: zero,
      safeLimitTokens: zero,
      moderateRiskMaxTokens: zero,
    };
  }

  const marginWithUserBorrowLimitTokens = (pool.userBorrowLimitProtectedCents ?? new BigNumber(0))
    .minus(pool.userBorrowBalanceProtectedCents ?? 0)
    .dividedBy(asset.userCollateralFactor)
    .dividedBy(asset.tokenSupplyPriceCents);

  const userLiquidationThreshold = asset.userLiquidationThresholdPercentage / 100;

  const rawMarginWithUserSafeBorrowLimitTokens = pool.userLiquidationThresholdCents
    .minus(pool.userBorrowBalanceCents.multipliedBy(HEALTH_FACTOR_SAFE_MAX_THRESHOLD))
    .dividedBy(userLiquidationThreshold)
    .dividedBy(asset.tokenPriceCents);

  const marginWithUserSafeBorrowLimitTokens = clampToZero({
    value: rawMarginWithUserSafeBorrowLimitTokens,
  });

  const rawMarginWithUserModerateRiskBorrowLimitTokens = pool.userLiquidationThresholdCents
    .minus(pool.userBorrowBalanceCents.multipliedBy(HEALTH_FACTOR_MODERATE_THRESHOLD))
    .dividedBy(userLiquidationThreshold)
    .dividedBy(asset.tokenPriceCents);

  const marginWithUserModerateRiskBorrowLimitTokens = clampToZero({
    value: rawMarginWithUserModerateRiskBorrowLimitTokens,
  });

  const limitTokens = BigNumber.min(availableTokens, marginWithUserBorrowLimitTokens).dp(
    asset.vToken.underlyingToken.decimals,
  );

  const safeLimitTokens = BigNumber.min(limitTokens, marginWithUserSafeBorrowLimitTokens).dp(
    asset.vToken.underlyingToken.decimals,
  );

  const moderateRiskMaxTokens = BigNumber.min(
    limitTokens,
    marginWithUserModerateRiskBorrowLimitTokens,
  ).dp(asset.vToken.underlyingToken.decimals);

  return {
    limitTokens,
    safeLimitTokens,
    moderateRiskMaxTokens,
  };
};
