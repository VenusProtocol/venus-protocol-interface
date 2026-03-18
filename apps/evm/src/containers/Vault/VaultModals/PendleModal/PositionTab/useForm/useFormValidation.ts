import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import type { FormError, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  availableTokens: BigNumber;
  token: Token;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError;
}

const useFormValidation = ({
  formValues,
  availableTokens,
  token,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError: FormError | undefined = useMemo(() => {
    const amountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!amountTokens || amountTokens.isNaN() || amountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    if (amountTokens.isGreaterThan(availableTokens)) {
      return {
        code: 'HIGHER_THAN_WALLET_BALANCE',
        message: t('pendleModal.error.higherThanBalance', {
          tokenSymbol: token.symbol,
        }),
      };
    }
  }, [formValues.amountTokens, availableTokens, token.symbol, t]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
