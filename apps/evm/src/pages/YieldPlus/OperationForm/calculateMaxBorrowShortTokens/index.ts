import BigNumber from 'bignumber.js';

const ZERO = new BigNumber(0);

const ceilDivide = (value: BigNumber, divisor: BigNumber) =>
  value.div(divisor).integerValue(BigNumber.ROUND_CEIL);
const floorValue = (value: BigNumber) => value.integerValue(BigNumber.ROUND_DOWN);

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
}: CalculateMaxBorrowShortTokensInput): BigNumber => {
  const suppliedPrincipalCents = dsaAmountTokens.multipliedBy(dsaTokenPriceCents);
  const longValueCents = longAmountTokens.multipliedBy(longTokenPriceCents);
  const borrowValueCents = shortAmountTokens.multipliedBy(shortTokenPriceCents);
  const nominalUtilizedCents = ceilDivide(borrowValueCents, new BigNumber(leverageFactor));

  const dsaCollateralFactor = new BigNumber(dsaTokenCollateralFactor);
  const longCollateralValueCents = floorValue(
    longValueCents.multipliedBy(longTokenCollateralFactor),
  );
  const excessBorrowCents = BigNumber.maximum(
    borrowValueCents.minus(longCollateralValueCents),
    ZERO,
  );

  let actualUtilizedCents = ZERO;

  if (!excessBorrowCents.isZero()) {
    actualUtilizedCents = dsaCollateralFactor.isZero()
      ? suppliedPrincipalCents
      : ceilDivide(excessBorrowCents, dsaCollateralFactor);
  }

  const finalUtilizedCents = BigNumber.minimum(
    suppliedPrincipalCents,
    BigNumber.maximum(actualUtilizedCents, nominalUtilizedCents),
  );

  const availableCapitalCents = BigNumber.maximum(
    suppliedPrincipalCents.minus(finalUtilizedCents),
    ZERO,
  );
  const maxAdditionalBorrowCents = floorValue(availableCapitalCents.multipliedBy(leverageFactor));

  return maxAdditionalBorrowCents
    .dividedBy(shortTokenPriceCents)
    .decimalPlaces(shortTokenDecimals, BigNumber.ROUND_DOWN);
};
