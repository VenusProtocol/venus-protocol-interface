import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import type { FormError, FormValues } from './types';

interface UseFormValidationInput {
  limitTokens: BigNumber;
  formValues: FormValues;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError;
}

const useFormValidation = ({
  limitTokens,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const formError: FormError | undefined = useMemo(() => {
    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return 'INVALID_TOKEN_AMOUNT';
    }

    if (fromTokenAmountTokens.isGreaterThan(limitTokens)) {
      return 'HIGHER_THAN_WITHDRAWABLE_AMOUNT';
    }
  }, [limitTokens, formValues.amountTokens]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
