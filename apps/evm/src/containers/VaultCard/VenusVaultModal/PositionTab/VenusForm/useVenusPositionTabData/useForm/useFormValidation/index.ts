import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import type { FormError, FormValues } from '../types';

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
    const tokenAmount = formValues.tokenAmount ? new BigNumber(formValues.tokenAmount) : undefined;

    if (tokenAmount && (tokenAmount.isNaN() || tokenAmount.isLessThanOrEqualTo(0))) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    if (!tokenAmount) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    if (availableTokens && tokenAmount.isGreaterThan(availableTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE',
        message: t('vault.venusModal.insufficientBalance', {
          tokenSymbol: token.symbol,
        }),
      };
    }
  }, [formValues.tokenAmount, availableTokens, token.symbol, t]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
