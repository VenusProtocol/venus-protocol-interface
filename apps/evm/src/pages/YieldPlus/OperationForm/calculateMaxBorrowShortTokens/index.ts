import BigNumber from 'bignumber.js';

export const calculateMaxBorrowShortTokens = ({
  dsaAmountTokens,
  dsaTokenPriceCents,
  dsaTokenCollateralFactor,
  shortTokenPriceCents,
  leverageFactor,
}: {
  dsaAmountTokens: BigNumber;
  dsaTokenPriceCents: BigNumber | number;
  dsaTokenCollateralFactor: number;
  shortTokenPriceCents: BigNumber;
  leverageFactor: number;
}) =>
  dsaAmountTokens.isGreaterThan(0)
    ? dsaAmountTokens
        .multipliedBy(dsaTokenPriceCents)
        .multipliedBy(dsaTokenCollateralFactor)
        .multipliedBy(leverageFactor)
        .dividedBy(shortTokenPriceCents)
    : new BigNumber(0);
