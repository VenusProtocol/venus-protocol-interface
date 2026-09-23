import BigNumber from 'bignumber.js';

import { HEALTH_FACTOR_SAFE_MAX_THRESHOLD } from 'constants/healthFactor';
import type { SpokeAsset, SpokePool } from 'types';
import { clampToZero } from 'utilities';

export interface GetBorrowLimitsInput {
  spokePool: SpokePool;
  asset: SpokeAsset;
}

export interface GetBorrowLimitsOutput {
  limitTokens: BigNumber;
  safeLimitTokens: BigNumber;
}

export const getBorrowLimits = ({
  spokePool,
  asset,
}: GetBorrowLimitsInput): GetBorrowLimitsOutput => {
  const {
    userBorrowLimitCents,
    userBorrowLimitProtectedCents,
    userBorrowBalanceCents,
    userBorrowBalanceProtectedCents,
    userLiquidationThresholdCents,
  } = spokePool;

  if (
    !userBorrowLimitCents ||
    !userBorrowBalanceCents ||
    !userLiquidationThresholdCents ||
    userBorrowBalanceProtectedCents?.isGreaterThanOrEqualTo(userBorrowLimitProtectedCents ?? 0) ||
    asset.borrowBalanceTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
  ) {
    return { limitTokens: new BigNumber(0), safeLimitTokens: new BigNumber(0) };
  }

  const assetLiquidityTokens = asset.liquidityCents.dividedBy(asset.tokenPriceCents);

  // Protected prices on both sides, matching the comptroller and the Core borrow form
  const marginWithUserBorrowLimitTokens = (userBorrowLimitProtectedCents ?? userBorrowLimitCents)
    .minus(userBorrowBalanceProtectedCents ?? userBorrowBalanceCents)
    .dividedBy(asset.tokenBorrowPriceCents);

  // The safe limit is based on the liquidation threshold because that is what the health
  // factor is computed from
  const marginWithUserSafeBorrowLimitTokens = clampToZero({
    value: userLiquidationThresholdCents
      .div(HEALTH_FACTOR_SAFE_MAX_THRESHOLD)
      .minus(userBorrowBalanceCents)
      .dividedBy(asset.tokenPriceCents),
  });

  const marginWithBorrowCapTokens = asset.borrowCapTokens.minus(asset.borrowBalanceTokens);

  const limitTokens = clampToZero({
    value: BigNumber.min(
      assetLiquidityTokens,
      marginWithUserBorrowLimitTokens,
      marginWithBorrowCapTokens,
    ),
  });

  const safeLimitTokens = BigNumber.min(limitTokens, marginWithUserSafeBorrowLimitTokens).dp(
    asset.vToken.underlyingToken.decimals,
  );

  return { limitTokens, safeLimitTokens };
};
