import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import type { FormError, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  availableTokens: BigNumber;
  token: Token;
  swapQuoteErrorCode?: string;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError;
}

const useFormValidation = ({
  formValues,
  availableTokens,
  token,
  swapQuoteErrorCode,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError: FormError | undefined = useMemo(() => {
    const tokenAmount = formValues.tokenAmount ? new BigNumber(formValues.tokenAmount) : undefined;

    if (swapQuoteErrorCode === 'noSwapQuoteFound') {
      return {
        code: 'NO_SWAP_QUOTE_FOUND' as const,
        message: t('vault.modals.error.noSwapQuoteFound'),
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
  }, [formValues.tokenAmount, availableTokens, token.symbol, t, swapQuoteErrorCode]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
