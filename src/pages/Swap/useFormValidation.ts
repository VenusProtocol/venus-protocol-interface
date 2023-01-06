import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Swap } from 'types';
import { areTokensEqual, convertTokensToWei } from 'utilities';

import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  fromTokenUserBalanceWei?: BigNumber;
  swap?: Swap;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  errors: FormError[];
}

const useFormValidation = ({
  swap,
  formValues,
  fromTokenUserBalanceWei,
}: UseFormValidationInput): UseFormValidationOutput => {
  const fromTokenAmountErrors = useMemo(() => {
    const fromTokenAmountWei =
      formValues.fromTokenAmountTokens &&
      convertTokensToWei({
        value: new BigNumber(formValues.fromTokenAmountTokens),
        token: formValues.fromToken,
      });

    const isInvalid = !fromTokenAmountWei || fromTokenAmountWei.isZero();

    const isHigherThanMax =
      fromTokenUserBalanceWei && fromTokenUserBalanceWei.isLessThan(fromTokenAmountWei);

    const errorsTmp: FormError[] = [];

    if (isInvalid) {
      errorsTmp.push('INVALID_FROM_TOKEN_AMOUNT');
    }

    if (isHigherThanMax) {
      errorsTmp.push('FROM_TOKEN_AMOUNT_HIGHER_THAN_USER_BALANCE');
    }

    return errorsTmp;
  }, [fromTokenUserBalanceWei?.toFixed(), formValues.fromTokenAmountTokens, formValues.fromToken]);

  const wrapUnwrapErrors = useMemo(() => {
    const errorsTmp: FormError[] = [];

    if (
      formValues.fromToken.isNative &&
      areTokensEqual(formValues.toToken, PANCAKE_SWAP_TOKENS.wbnb)
    ) {
      errorsTmp.push('WRAPPING_UNSUPPORTED');
    }

    if (
      formValues.toToken.isNative &&
      areTokensEqual(formValues.fromToken, PANCAKE_SWAP_TOKENS.wbnb)
    ) {
      errorsTmp.push('UNWRAPPING_UNSUPPORTED');
    }

    return errorsTmp;
  }, [formValues.fromToken, formValues.toToken]);

  const errors = wrapUnwrapErrors.concat(fromTokenAmountErrors);
  const isFormValid = !!swap && errors.length === 0;

  return {
    isFormValid,
    errors,
  };
};

export default useFormValidation;
