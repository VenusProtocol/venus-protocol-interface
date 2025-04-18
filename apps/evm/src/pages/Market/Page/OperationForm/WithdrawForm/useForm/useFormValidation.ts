import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { HEALTH_FACTOR_LIQUIDATION_THRESHOLD } from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool } from 'types';
import { calculateHealthFactor } from 'utilities';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  pool: Pool;
  limitTokens: BigNumber;
  formValues: FormValues;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  pool,
  limitTokens,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError = useMemo<FormError<FormErrorCode> | undefined>(() => {
    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(
      asset.tokenPriceCents,
    );

    if (fromTokenAmountTokens.isGreaterThan(assetLiquidityTokens)) {
      // User is trying to withdraw more than available liquidity
      return {
        code: 'HIGHER_THAN_LIQUIDITY',
        message: t('operationForm.error.higherThanAvailableLiquidity'),
      };
    }

    if (fromTokenAmountTokens.isGreaterThan(limitTokens)) {
      return {
        code: 'HIGHER_THAN_WITHDRAWABLE_AMOUNT',
        message: t('operationForm.error.higherThanWithdrawableAmount'),
      };
    }

    const hypotheticalUserBorrowLimitCents =
      asset.isCollateralOfUser && pool.userBorrowLimitCents && fromTokenAmountTokens
        ? pool.userBorrowLimitCents.minus(
            fromTokenAmountTokens
              .multipliedBy(asset.tokenPriceCents)
              .multipliedBy(asset.collateralFactor),
          )
        : pool.userBorrowLimitCents;

    const hypotheticalHealthFactor =
      pool.userBorrowBalanceCents && hypotheticalUserBorrowLimitCents
        ? calculateHealthFactor({
            borrowBalanceCents: pool.userBorrowBalanceCents.toNumber(),
            borrowLimitCents: hypotheticalUserBorrowLimitCents.toNumber(),
          })
        : undefined;

    if (
      hypotheticalHealthFactor !== undefined &&
      hypotheticalHealthFactor <= HEALTH_FACTOR_LIQUIDATION_THRESHOLD
    ) {
      return {
        code: 'TOO_RISKY',
        message: t('operationForm.error.tooRisky'),
      };
    }
  }, [limitTokens, formValues.amountTokens, t, asset, pool]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
