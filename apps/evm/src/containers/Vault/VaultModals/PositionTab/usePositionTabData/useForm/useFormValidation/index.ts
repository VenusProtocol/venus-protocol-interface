import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import type { PendleSwapQuoteError } from 'clients/api';
import type { FormError, FormValues } from '../types';

interface UseFormValidationInput {
  formValues: FormValues;
  availableTokens: BigNumber;
  token: Token;
  swapQuoteError?: PendleSwapQuoteError;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError;
}

const useFormValidation = ({
  formValues,
  availableTokens,
  token,
  swapQuoteError,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError: FormError | undefined = useMemo(() => {
    const tokenAmount = formValues.tokenAmount ? new BigNumber(formValues.tokenAmount) : undefined;

    if (tokenAmount && availableTokens && tokenAmount.isGreaterThan(availableTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE',
        message: t('vault.modals.error.higherThanAvailable', {
          tokenSymbol: token.symbol,
        }),
      };
    }

    if (swapQuoteError?.code === 'PENDLE_NO_ROUTE_FOUND') {
      return {
        code: 'PENDLE_NO_ROUTE_FOUND',
        message: t('vault.modals.error.noSwapQuoteFound'),
      };
    }

    if (swapQuoteError?.code === 'PENDLE_AMOUNT_TOO_LOW') {
      return {
        code: 'PENDLE_AMOUNT_TOO_LOW',
        message: swapQuoteError.data?.exception
          ? t('vault.modals.error.lowerThanMinimumAmount', {
              amount: swapQuoteError.data?.exception,
            })
          : t('vault.modals.error.amountTooLow'),
      };
    }

    if (swapQuoteError?.code === 'PENDLE_INVALID_AMOUNT') {
      return {
        code: 'PENDLE_INVALID_AMOUNT',
        message: t('vault.modals.error.invalidAmountFromQuote'),
      };
    }

    if (swapQuoteError?.code === 'PENDLE_API_ERROR') {
      return {
        code: 'PENDLE_API_ERROR',
        message: t('vault.modals.error.pendleApiError'),
      };
    }

    if (tokenAmount && (tokenAmount.isNaN() || tokenAmount.isLessThanOrEqualTo(0))) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
        message: t('vault.modals.error.invalidAmount'),
      };
    }

    if (!tokenAmount) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }
  }, [formValues.tokenAmount, availableTokens, token.symbol, t, swapQuoteError]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
