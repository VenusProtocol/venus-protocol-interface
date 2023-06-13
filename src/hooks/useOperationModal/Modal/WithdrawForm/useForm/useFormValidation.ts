import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset } from 'types';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  formValues: FormValues;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError;
}

const useFormValidation = ({
  asset,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const formError: FormError | undefined = useMemo(() => {
    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return 'INVALID_TOKEN_AMOUNT';
    }

    if (fromTokenAmountTokens.isGreaterThan(asset.userSupplyBalanceTokens)) {
      return 'HIGHER_THAN_WITHDRAWABLE_AMOUNT';
    }
  }, [asset.userSupplyBalanceTokens, formValues.amountTokens]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
