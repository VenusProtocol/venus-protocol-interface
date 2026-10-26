import BigNumber from 'bignumber.js';

import { COMPOUND_MANTISSA } from 'constants/compoundMantissa';
import { HEALTH_FACTOR_SAFE_MAX_THRESHOLD } from 'constants/healthFactor';
import type { SpokeAsset, SpokePool } from 'types';
import { clampToZero, convertMantissaToTokens } from 'utilities';

const PENDING_RESERVES_BLOCK_COUNT = 1000;

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

  const borrowedTokens = asset.borrowBalanceTokens.plus(
    convertMantissaToTokens({
      value: new BigNumber(asset.badDebtMantissa.toString()),
      token: asset.vToken.underlyingToken,
    }),
  );

  if (
    !userBorrowLimitCents ||
    !userBorrowBalanceCents ||
    !userLiquidationThresholdCents ||
    userBorrowBalanceProtectedCents?.isGreaterThanOrEqualTo(userBorrowLimitProtectedCents ?? 0) ||
    borrowedTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
  ) {
    return { limitTokens: new BigNumber(0), safeLimitTokens: new BigNumber(0) };
  }

  // Accrued reserves get swept from cash before the borrow
  const pendingReservesTokens = asset.borrowBalanceTokens
    .multipliedBy(asset.borrowRatePerBlockMantissa)
    .div(COMPOUND_MANTISSA)
    .multipliedBy(asset.reserveFactor)
    .multipliedBy(PENDING_RESERVES_BLOCK_COUNT);

  const assetLiquidityTokens = asset.cashTokens
    .minus(asset.reserveTokens)
    .minus(pendingReservesTokens);

  // Protected prices on both sides, like the comptroller
  const marginWithUserBorrowLimitTokens = (userBorrowLimitProtectedCents ?? userBorrowLimitCents)
    .minus(userBorrowBalanceProtectedCents ?? userBorrowBalanceCents)
    .dividedBy(asset.tokenBorrowPriceCents);

  // Health factor uses liquidation threshold, so the safe limit does
  const marginWithUserSafeBorrowLimitTokens = clampToZero({
    value: userLiquidationThresholdCents
      .div(HEALTH_FACTOR_SAFE_MAX_THRESHOLD)
      .minus(userBorrowBalanceCents)
      .dividedBy(asset.tokenPriceCents),
  });

  const marginWithBorrowCapTokens = asset.borrowCapTokens.minus(borrowedTokens);

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
