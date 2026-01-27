import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool, SwapQuote, SwapQuoteError } from 'types';
import type { FormError } from '../../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  repaidAsset: Asset;
  limitTokens: BigNumber;
  isUsingSwap: boolean;
  simulatedPool?: Pool;
  swapQuote?: SwapQuote;
  getSwapQuoteError?: SwapQuoteError;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formErrors: FormError<FormErrorCode>[];
}

const useFormValidation = ({
  limitTokens,
  repaidAsset,
  formValues,
  simulatedPool,
  swapQuote,
  getSwapQuoteError,
  isUsingSwap,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formErrors = useMemo<FormError<FormErrorCode>[]>(() => {
    const tmpErrors: FormError<FormErrorCode>[] = [];

    const collateralAmountTokens = formValues.collateralAmountTokens
      ? new BigNumber(formValues.collateralAmountTokens)
      : undefined;

    const repaidAmountTokens = formValues.repaidAmountTokens
      ? new BigNumber(formValues.repaidAmountTokens)
      : undefined;

    if (collateralAmountTokens?.isGreaterThan(limitTokens)) {
      tmpErrors.push({
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      });
    }

    if (repaidAmountTokens?.isGreaterThan(repaidAsset.userBorrowBalanceTokens)) {
      tmpErrors.push({
        code: 'HIGHER_THAN_BORROW_BALANCE',
        message: t('operationForm.error.higherThanBorrowBalance'),
      });
    }

    if (!collateralAmountTokens?.isGreaterThan(0) || !repaidAmountTokens?.isGreaterThan(0)) {
      tmpErrors.push({
        code: 'EMPTY_TOKEN_AMOUNT',
      });
    }

    if (getSwapQuoteError?.code === 'noSwapQuoteFound') {
      tmpErrors.push({
        code: 'NO_SWAP_QUOTE_FOUND',
        message: t('operationForm.error.noSwapQuoteFound'),
      });
    }

    if (
      simulatedPool?.userHealthFactor !== undefined &&
      simulatedPool.userHealthFactor <= HEALTH_FACTOR_LIQUIDATION_THRESHOLD
    ) {
      tmpErrors.push({
        code: 'TOO_RISKY',
        message: t('operationForm.error.tooRisky'),
      });
    }

    if (
      swapQuote &&
      swapQuote?.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      tmpErrors.push({
        code: 'SWAP_PRICE_IMPACT_TOO_HIGH',
        message: t('operationForm.error.priceImpactTooHigh'),
      });
    }

    if (
      swapQuote &&
      swapQuote?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE &&
      swapQuote?.priceImpactPercentage < MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE &&
      !formValues.acknowledgeHighPriceImpact
    ) {
      tmpErrors.push({
        code: 'REQUIRES_SWAP_PRICE_IMPACT_ACKNOWLEDGEMENT',
      });
    }

    if (
      simulatedPool?.userHealthFactor !== undefined &&
      simulatedPool.userHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
      !formValues.acknowledgeRisk
    ) {
      tmpErrors.push({
        code: 'REQUIRES_RISK_ACKNOWLEDGEMENT',
      });
    }

    if (!simulatedPool || (!swapQuote && isUsingSwap)) {
      tmpErrors.push({
        code: 'MISSING_DATA',
      });
    }

    return tmpErrors;
  }, [
    limitTokens,
    formValues.collateralAmountTokens,
    formValues.acknowledgeRisk,
    formValues.acknowledgeHighPriceImpact,
    formValues.repaidAmountTokens,
    repaidAsset.userBorrowBalanceTokens,
    t,
    simulatedPool,
    swapQuote,
    isUsingSwap,
    getSwapQuoteError?.code,
  ]);

  return {
    isFormValid: !formErrors.length,
    formErrors,
  };
};

export default useFormValidation;
