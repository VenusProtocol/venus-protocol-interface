import BigNumber from 'bignumber.js';

export const calculateMaximumLeverageFactor = ({
  dsaTokenCollateralFactor,
  longTokenCollateralFactor,
  proportionalCloseTolerancePercentage,
}: {
  dsaTokenCollateralFactor: number;
  longTokenCollateralFactor: number;
  proportionalCloseTolerancePercentage: number;
}) => {
  const unroundedMaximumLeverageFactor =
    dsaTokenCollateralFactor /
    (1 - longTokenCollateralFactor * (1 - proportionalCloseTolerancePercentage / 100));

  return new BigNumber(unroundedMaximumLeverageFactor).dp(2, BigNumber.ROUND_DOWN).toNumber();
};
