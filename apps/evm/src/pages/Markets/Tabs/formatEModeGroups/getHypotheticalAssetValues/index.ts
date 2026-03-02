export const getHypotheticalAssetValues = ({
  userSupplyBalanceCents,
  userBorrowBalanceCents,
  isBorrowable,
  isCollateralOfUser,
  collateralFactor,
  liquidationThresholdPercentage,
}: {
  userSupplyBalanceCents: number;
  userBorrowBalanceCents: number;
  isBorrowable: boolean;
  isCollateralOfUser: boolean;
  collateralFactor: number;
  liquidationThresholdPercentage: number;
}) => {
  let isBlocking = false;
  let liquidationThresholdCents = 0;
  let borrowLimitCents = 0;
  let borrowBalanceCents = 0;

  if (!isBorrowable && userBorrowBalanceCents > 0) {
    isBlocking = true;
  }

  if (isBorrowable) {
    borrowBalanceCents += userBorrowBalanceCents;
  }

  if (!!collateralFactor && !!liquidationThresholdPercentage && isCollateralOfUser) {
    borrowLimitCents += userSupplyBalanceCents * collateralFactor;

    liquidationThresholdCents += (userSupplyBalanceCents * liquidationThresholdPercentage) / 100;
  }

  return {
    isBlocking,
    liquidationThresholdCents,
    borrowLimitCents,
    borrowBalanceCents,
  };
};
