import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import type { Asset, Pool } from 'types';

import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';
import { formatTokensToReadableValue } from 'utilities';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  pool: Pool;
  limitTokens: BigNumber;
  formValues: FormValues;
  hypotheticalHealthFactor?: number;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  pool,
  limitTokens,
  hypotheticalHealthFactor,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError = useMemo<FormError<FormErrorCode> | undefined>(() => {
    if (!pool?.userBorrowLimitCents || pool.userBorrowLimitCents.isEqualTo(0)) {
      return {
        code: 'NO_COLLATERALS',
        message: t('operationForm.error.noCollateral', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        }),
      };
    }

    if (
      asset.borrowCapTokens &&
      asset.borrowBalanceTokens.isGreaterThanOrEqualTo(asset.borrowCapTokens)
    ) {
      return {
        code: 'BORROW_CAP_ALREADY_REACHED',
        message: t('operationForm.error.borrowCapReached', {
          assetBorrowCap: formatTokensToReadableValue({
            value: asset.borrowCapTokens,
            token: asset.vToken.underlyingToken,
          }),
        }),
      };
    }

    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    if (
      asset.borrowCapTokens &&
      asset.borrowBalanceTokens.plus(fromTokenAmountTokens).isGreaterThan(asset.borrowCapTokens)
    ) {
      return {
        code: 'HIGHER_THAN_BORROW_CAP',
        message: t('operationForm.error.higherThanBorrowCap', {
          userMaxBorrowAmount: formatTokensToReadableValue({
            value: asset.borrowCapTokens.minus(asset.borrowBalanceTokens),
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
          assetBorrowCap: formatTokensToReadableValue({
            value: asset.borrowCapTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
          assetBorrowBalance: formatTokensToReadableValue({
            value: asset.borrowBalanceTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
        }),
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
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      };
    }

    if (
      hypotheticalHealthFactor !== undefined &&
      hypotheticalHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
      !formValues.acknowledgeRisk
    ) {
      return {
        code: 'REQUIRES_RISK_ACKNOWLEDGEMENT',
      };
    }
  }, [
    asset,
    pool,
    limitTokens,
    hypotheticalHealthFactor,
    formValues.amountTokens,
    formValues.acknowledgeRisk,
    t,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
