import BigNumber from 'bignumber.js';
import { calculateUnusedCollateralCents } from '../calculateUnusedCollateralCents';

export interface CalculateMaxBorrowShortTokensInput {
  dsaAmountTokens: BigNumber;
  dsaTokenPriceCents: BigNumber | number;
  dsaTokenCollateralFactor: number;
  longAmountTokens: BigNumber;
  longTokenPriceCents: BigNumber | number;
  longTokenCollateralFactor: number;
  shortAmountTokens: BigNumber;
  shortTokenPriceCents: BigNumber | number;
  leverageFactor: number;
  shortTokenDecimals: number;
  proportionalCloseTolerancePercentage: number;
}

export const calculateMaxBorrowShortTokens = ({
  dsaAmountTokens,
  dsaTokenPriceCents,
  dsaTokenCollateralFactor,
  longAmountTokens,
  longTokenPriceCents,
  longTokenCollateralFactor,
  shortAmountTokens,
  shortTokenPriceCents,
  leverageFactor,
  shortTokenDecimals,
  proportionalCloseTolerancePercentage,
}: CalculateMaxBorrowShortTokensInput): BigNumber => {
  const unusedCollateralCents = calculateUnusedCollateralCents({
    dsaAmountTokens,
    dsaTokenPriceCents,
    dsaTokenCollateralFactor,
    longAmountTokens,
    longTokenPriceCents,
    longTokenCollateralFactor,
    shortAmountTokens,
    shortTokenPriceCents,
    leverageFactor,
    proportionalCloseTolerancePercentage,
  });

  const maxAdditionalBorrowCents = unusedCollateralCents
    .multipliedBy(leverageFactor)
    .integerValue(BigNumber.ROUND_DOWN);

  return maxAdditionalBorrowCents
    .dividedBy(shortTokenPriceCents)
    .decimalPlaces(shortTokenDecimals, BigNumber.ROUND_DOWN);
};
