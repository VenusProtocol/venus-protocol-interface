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

    if (swapQuoteError?.code === 'noSwapQuoteFound') {
      return {
        code: 'NO_SWAP_QUOTE_FOUND' as const,
        message: t('vault.modals.error.noSwapQuoteFound'),
      };
    }

    if (swapQuoteError?.code === 'lowerThanMinimum') {
      return {
        code: 'LOWER_THAN_MINIMUM' as const,
        message: t('vault.modals.error.lowerThanMinimum', {
          amount: swapQuoteError.data?.exception,
        }),
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
