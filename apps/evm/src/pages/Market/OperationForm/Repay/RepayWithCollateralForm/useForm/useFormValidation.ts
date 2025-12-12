import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  HEALTH_FACTOR_LIQUIDATION_THRESHOLD,
  HEALTH_FACTOR_MODERATE_THRESHOLD,
} from 'constants/healthFactor';
import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import type { VError } from 'libs/errors';
import { useTranslation } from 'libs/translations';
import type { Asset, Pool, SwapQuote } from 'types';
import type { FormError } from '../../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  repaidAsset: Asset;
  limitTokens: BigNumber;
  isUsingSwap: boolean;
  simulatedPool?: Pool;
  swapQuote?: SwapQuote;
  getSwapQuoteError?: VError<'swapQuote' | 'interaction'>;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
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

  const formError = useMemo<FormError<FormErrorCode> | undefined>(() => {
    const collateralAmountTokens = formValues.collateralAmountTokens
      ? new BigNumber(formValues.collateralAmountTokens)
      : undefined;

    const repaidAmountTokens = formValues.repaidAmountTokens
      ? new BigNumber(formValues.repaidAmountTokens)
      : undefined;

    if (collateralAmountTokens?.isGreaterThan(limitTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      };
    }

    if (repaidAmountTokens?.isGreaterThan(repaidAsset.userBorrowBalanceTokens)) {
      return {
        code: 'HIGHER_THAN_BORROW_BALANCE',
        message: t('operationForm.error.higherThanBorrowBalance'),
      };
    }

    if (getSwapQuoteError?.code === 'noSwapQuoteFound') {
      return {
        code: 'NO_SWAP_QUOTE_FOUND',
        message: t('operationForm.error.noSwapQuoteFound'),
      };
    }

    if (!collateralAmountTokens?.isGreaterThan(0) || !repaidAmountTokens?.isGreaterThan(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    if (
      swapQuote &&
      swapQuote?.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      return {
        code: 'SWAP_PRICE_IMPACT_TOO_HIGH',
        message: t('operationForm.error.priceImpactTooHigh'),
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

    if (!simulatedPool || (!swapQuote && isUsingSwap)) {
      return {
        code: 'MISSING_DATA',
      };
    }
  }, [
    limitTokens,
    formValues.collateralAmountTokens,
    formValues.acknowledgeRisk,
    formValues.repaidAmountTokens,
    repaidAsset.userBorrowBalanceTokens,
    t,
    simulatedPool,
    swapQuote,
    isUsingSwap,
    getSwapQuoteError?.code,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
