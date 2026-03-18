import BigNumber from 'bignumber.js';

export interface CalculateMaxLeverageFactorInput {
  dsaTokenCollateralFactor: number;
  longTokenCollateralFactor: number;
  proportionalCloseTolerancePercentage: number;
}

export const calculateMaxLeverageFactor = ({
  dsaTokenCollateralFactor,
  longTokenCollateralFactor,
  proportionalCloseTolerancePercentage,
}: CalculateMaxLeverageFactorInput) =>
  new BigNumber(
    dsaTokenCollateralFactor /
      (1 - longTokenCollateralFactor * (1 - proportionalCloseTolerancePercentage / 100)),
  )
    .dp(2, BigNumber.ROUND_DOWN)
    .toNumber();
