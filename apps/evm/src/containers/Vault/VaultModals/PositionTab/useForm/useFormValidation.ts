import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import type { PendleSwapQuoteError } from 'clients/api';
import type { FormError, FormValues } from './types';

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

    if (swapQuoteError?.code === 'PENDLE_NO_ROUTE_FOUND') {
      return {
        code: 'PENDLE_NO_ROUTE_FOUND' as const,
        message: t('vault.modals.error.noSwapQuoteFound'),
      };
    }

    if (swapQuoteError?.code === 'PENDLE_AMOUNT_TOO_LOW') {
      return {
        code: 'PENDLE_AMOUNT_TOO_LOW' as const,
        message: swapQuoteError.data?.exception
          ? t('vault.modals.error.lowerThanMinimumAmount', {
              amount: swapQuoteError.data?.exception,
            })
          : t('vault.modals.error.amountTooLow'),
      };
    }

    if (swapQuoteError?.code === 'PENDLE_INVALID_AMOUNT') {
      return {
        code: 'PENDLE_INVALID_AMOUNT' as const,
        message: t('vault.modals.error.invalidAmount'),
      };
    }

    if (!tokenAmount || tokenAmount.isNaN() || tokenAmount.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT' as const,
      };
    }

    if (tokenAmount.isGreaterThan(availableTokens)) {
      return {
        code: 'HIGHER_THAN_WALLET_BALANCE' as const,
        message: t('vault.modals.error.higherThanBalance', {
          tokenSymbol: token.symbol,
        }),
      };
    }
  }, [formValues.tokenAmount, availableTokens, token.symbol, t, swapQuoteError]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
