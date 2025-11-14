import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import type { Asset, Pool } from 'types';

import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';
import { formatTokensToReadableValue } from 'utilities';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  pool: Pool;
  formValues: FormValues;
  limitTokens: BigNumber;
  simulatedPool?: Pool;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  pool,
  limitTokens,
  simulatedPool,
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

    const borrowedTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!borrowedTokenAmountTokens || borrowedTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    if (
      asset.borrowCapTokens &&
      asset.borrowBalanceTokens.plus(borrowedTokenAmountTokens).isGreaterThan(asset.borrowCapTokens)
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

    if (borrowedTokenAmountTokens.isGreaterThan(assetLiquidityTokens)) {
      // User is trying to borrow more than available liquidity
      return {
        code: 'HIGHER_THAN_LIQUIDITY',
        message: t('operationForm.error.higherThanAvailableLiquidity'),
      };
    }

    if (borrowedTokenAmountTokens.isGreaterThan(limitTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      };
    }

    if (
      simulatedPool?.userHealthFactor !== undefined &&
      simulatedPool.userHealthFactor <= HEALTH_FACTOR_LIQUIDATION_THRESHOLD
    ) {
      return {
        code: 'TOO_RISKY',
        message: t('operationForm.error.tooRisky'),
      };
    }

    if (
      simulatedPool?.userHealthFactor !== undefined &&
      simulatedPool.userHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
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
    simulatedPool,
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
