import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Swap } from 'types';
import { convertTokensToWei } from 'utilities';

import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  fromTokenUserBalanceWei?: BigNumber;
  swapInfo?: Swap;
}

interface UseFormValidationOutput {
  isValid: boolean;
  errors: FormError[];
}

const useFormValidation = ({
  swapInfo,
  formValues,
  fromTokenUserBalanceWei,
}: UseFormValidationInput): UseFormValidationOutput => {
  const fromTokenAmountErrors = useMemo(() => {
    const isFromTokensAmountInputValid =
      !fromTokenUserBalanceWei ||
      !formValues.fromTokenAmountTokens ||
      fromTokenUserBalanceWei.isGreaterThanOrEqualTo(
        convertTokensToWei({
          value: new BigNumber(formValues.fromTokenAmountTokens),
          token: formValues.fromToken,
        }),
      );

    const errorsTmp: FormError[] = [];

    if (!isFromTokensAmountInputValid) {
      errorsTmp.push('FROM_TOKEN_AMOUNT_HIGHER_THAN_USER_BALANCE');
    }

    return errorsTmp;
  }, [fromTokenUserBalanceWei?.toFixed(), formValues.fromTokenAmountTokens, formValues.fromToken]);

  const wrapUnwrapErrors = useMemo(() => {
    const errorsTmp: FormError[] = [];

    if (
      formValues.fromToken.isNative &&
      formValues.toToken.address === PANCAKE_SWAP_TOKENS.wbnb.address
    ) {
      errorsTmp.push('IS_WRAP');
    }

    if (
      formValues.toToken.isNative &&
      formValues.fromToken.address === PANCAKE_SWAP_TOKENS.wbnb.address
    ) {
      errorsTmp.push('IS_UNWRAP');
    }

    return errorsTmp;
  }, [formValues.fromToken, formValues.toToken]);

  const errors = wrapUnwrapErrors.concat(fromTokenAmountErrors);
  const isValid = !!swapInfo && errors.length === 0;

  return {
    isValid,
    errors,
  };
};

export default useFormValidation;
