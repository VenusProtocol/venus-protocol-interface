import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { Swap } from 'types';
import { convertTokensToMantissa } from 'utilities';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  isFromTokenApproved?: boolean;
  fromTokenUserBalanceMantissa?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  swap?: Swap;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  errors: FormError[];
}

const useFormValidation = ({
  swap,
  isFromTokenApproved,
  formValues,
  fromTokenUserBalanceMantissa,
  fromTokenWalletSpendingLimitTokens,
}: UseFormValidationInput): UseFormValidationOutput => {
  const fromTokenAmountErrors = useMemo(() => {
    const fromTokenAmountMantissa =
      formValues.fromTokenAmountTokens &&
      convertTokensToMantissa({
        value: new BigNumber(formValues.fromTokenAmountTokens),
        token: formValues.fromToken,
      });

    const isInvalid = !fromTokenAmountMantissa || fromTokenAmountMantissa.isLessThanOrEqualTo(0);

    const isHigherThanMax =
      fromTokenUserBalanceMantissa &&
      fromTokenUserBalanceMantissa.isLessThan(fromTokenAmountMantissa);

    const errorsTmp: FormError[] = [];

    if (isInvalid) {
      errorsTmp.push('INVALID_FROM_TOKEN_AMOUNT');
    }

    if (isHigherThanMax) {
      errorsTmp.push('FROM_TOKEN_AMOUNT_HIGHER_THAN_USER_BALANCE');
    }

    if (
      isFromTokenApproved &&
      fromTokenWalletSpendingLimitTokens &&
      new BigNumber(formValues.fromTokenAmountTokens).isGreaterThan(
        fromTokenWalletSpendingLimitTokens,
      )
    ) {
      errorsTmp.push('FROM_TOKEN_AMOUNT_HIGHER_THAN_WALLET_SPENDING_LIMIT');
    }

    if (
      !!swap?.priceImpactPercentage &&
      swap?.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      errorsTmp.push('PRICE_IMPACT_TOO_HIGH');
    }

    return errorsTmp;
  }, [
    fromTokenUserBalanceMantissa,
    formValues.fromTokenAmountTokens,
    formValues.fromToken,
    isFromTokenApproved,
    fromTokenWalletSpendingLimitTokens,
    swap,
  ]);

  const wrapUnwrapErrors = useMemo(() => {
    const errorsTmp: FormError[] = [];

    if (formValues.fromToken.isNative && formValues.toToken.symbol === 'WBNB') {
      errorsTmp.push('WRAPPING_UNSUPPORTED');
    }

    if (formValues.toToken.isNative && formValues.fromToken.symbol === 'WBNB') {
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
