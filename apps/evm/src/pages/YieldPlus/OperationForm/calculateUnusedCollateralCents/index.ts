import BigNumber from 'bignumber.js';

import { calculateMaxLeverageFactor } from '../../calculateMaxLeverageFactor';
import { ceilDivide } from './ceilDivide';

export interface CalculateUnusedCollateralCentsInput {
  dsaAmountTokens: BigNumber;
  dsaTokenPriceCents: BigNumber | number;
  dsaTokenCollateralFactor: number;
  longAmountTokens: BigNumber;
  longTokenPriceCents: BigNumber | number;
  longTokenCollateralFactor: number;
  shortAmountTokens: BigNumber;
  shortTokenPriceCents: BigNumber | number;
  leverageFactor: number;
  proportionalCloseTolerancePercentage: number;
}

export const calculateUnusedCollateralCents = ({
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
}: CalculateUnusedCollateralCentsInput): BigNumber => {
  const dsaBalanceCents = dsaAmountTokens.multipliedBy(dsaTokenPriceCents);
  const longBalanceCents = longAmountTokens.multipliedBy(longTokenPriceCents);
  const shortBalanceCents = shortAmountTokens.multipliedBy(shortTokenPriceCents);

  // Clamp leverage factor to maximum allowed by collateral (this function could be used with an
  // existing position that was opened with a certain collateral factor, that was reduced later on)
  const maxLeverageFactor = calculateMaxLeverageFactor({
    dsaTokenCollateralFactor: dsaTokenCollateralFactor,
    longTokenCollateralFactor: longTokenCollateralFactor,
    proportionalCloseTolerancePercentage,
  });
  const clampedLeverageFactor = BigNumber.min(maxLeverageFactor, leverageFactor);

  const dsaNominalUtilizedCents = clampedLeverageFactor.isZero()
    ? new BigNumber(0)
    : ceilDivide(shortBalanceCents, clampedLeverageFactor);

  const longCollateralValueCents = longBalanceCents
    .multipliedBy(longTokenCollateralFactor)
    .integerValue(BigNumber.ROUND_DOWN);

  const excessBorrowCents = BigNumber.maximum(
    shortBalanceCents.minus(longCollateralValueCents),
    new BigNumber(0),
  );

  let dsaActualUtilizedCents = new BigNumber(0);

  if (!excessBorrowCents.isZero()) {
    dsaActualUtilizedCents =
      dsaTokenCollateralFactor === 0
        ? dsaBalanceCents
        : ceilDivide(excessBorrowCents, new BigNumber(dsaTokenCollateralFactor));
  }

  const dsaUtilizedCents = BigNumber.minimum(
    dsaBalanceCents,
    BigNumber.maximum(dsaActualUtilizedCents, dsaNominalUtilizedCents),
  );

  const unusedCollateralCents = BigNumber.maximum(
    dsaBalanceCents.minus(dsaUtilizedCents),
    new BigNumber(0),
  );

  return unusedCollateralCents;
};
