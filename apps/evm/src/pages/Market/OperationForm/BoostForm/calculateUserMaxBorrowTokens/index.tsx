import BigNumber from 'bignumber.js';

import type { Asset } from 'types';
import { clampToZero } from 'utilities';

export const calculateUserMaxBorrowTokens = ({
  borrowedAsset,
  suppliedAsset,
  userBorrowingPowerCents,
}: { borrowedAsset: Asset; suppliedAsset: Asset; userBorrowingPowerCents: BigNumber }) => {
  const userMaxBorrowCents = userBorrowingPowerCents.div(
    new BigNumber(1).minus(suppliedAsset.userCollateralFactor),
  );

  const userMaxBorrowTokens = userMaxBorrowCents
    .div(borrowedAsset.tokenPriceCents)
    .dp(borrowedAsset.vToken.underlyingToken.decimals);

  const marginWithBorrowCapTokens = borrowedAsset.borrowCapTokens.minus(
    borrowedAsset.borrowBalanceTokens,
  );

  // Take borrow cap in consideration
  return clampToZero({
    value: BigNumber.min(userMaxBorrowTokens, marginWithBorrowCapTokens, borrowedAsset.cashTokens),
  });
};
