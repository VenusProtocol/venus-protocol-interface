import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Swap } from 'types';
import { areTokensEqual, convertTokensToWei } from 'utilities';

import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { SWAP_TOKENS } from 'constants/tokens';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  isFromTokenApproved?: boolean;
  fromTokenUserBalanceWei?: BigNumber;
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
  fromTokenUserBalanceWei,
  fromTokenWalletSpendingLimitTokens,
}: UseFormValidationInput): UseFormValidationOutput => {
  const fromTokenAmountErrors = useMemo(() => {
    const fromTokenAmountWei =
      formValues.fromTokenAmountTokens &&
      convertTokensToWei({
        value: new BigNumber(formValues.fromTokenAmountTokens),
        token: formValues.fromToken,
      });

    const isInvalid = !fromTokenAmountWei || fromTokenAmountWei.isLessThanOrEqualTo(0);

    const isHigherThanMax =
      fromTokenUserBalanceWei && fromTokenUserBalanceWei.isLessThan(fromTokenAmountWei);

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
    fromTokenUserBalanceWei?.toFixed(),
    formValues.fromTokenAmountTokens,
    formValues.fromToken,
    isFromTokenApproved,
    fromTokenWalletSpendingLimitTokens,
    swap,
  ]);

  const wrapUnwrapErrors = useMemo(() => {
    const errorsTmp: FormError[] = [];

    if (formValues.fromToken.isNative && areTokensEqual(formValues.toToken, SWAP_TOKENS.wbnb)) {
      errorsTmp.push('WRAPPING_UNSUPPORTED');
    }

    if (formValues.toToken.isNative && areTokensEqual(formValues.fromToken, SWAP_TOKENS.wbnb)) {
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
