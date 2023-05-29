import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Swap, SwapError, Token } from 'types';
import { areTokensEqual, convertWeiToTokens } from 'utilities';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  toToken: Token;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenUserBorrowBalanceTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError;
}

const getSwapToTokenAmountReceivedTokens = (swap?: Swap) => {
  let swapToTokenAmountReceivedTokens;

  if (swap) {
    const swapToTokenAmountReceivedWei =
      swap.direction === 'exactAmountOut'
        ? swap.toTokenAmountReceivedWei
        : swap.expectedToTokenAmountReceivedWei;

    swapToTokenAmountReceivedTokens = convertWeiToTokens({
      valueWei: swapToTokenAmountReceivedWei,
      token: swap.toToken,
    });
  }

  return swapToTokenAmountReceivedTokens;
};

const useFormValidation = ({
  swap,
  swapError,
  toToken,
  formValues,
  fromTokenUserWalletBalanceTokens,
  fromTokenUserBorrowBalanceTokens,
}: UseFormValidationInput): UseFormValidationOutput => {
  const formError: FormError | undefined = useMemo(() => {
    const swapErrorMapping: {
      [key: string]: FormError;
    } = {
      INSUFFICIENT_LIQUIDITY: 'SWAP_INSUFFICIENT_LIQUIDITY',
      WRAPPING_UNSUPPORTED: 'SWAP_WRAPPING_UNSUPPORTED',
      UNWRAPPING_UNSUPPORTED: 'SWAP_UNWRAPPING_UNSUPPORTED',
    };

    if (swapError && swapError in swapErrorMapping) {
      return swapErrorMapping[swapError];
    }

    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return 'INVALID_TOKEN_AMOUNT';
    }

    if (
      fromTokenUserWalletBalanceTokens &&
      fromTokenAmountTokens.isGreaterThan(fromTokenUserWalletBalanceTokens)
    ) {
      return 'HIGHER_THAN_WALLET_BALANCE';
    }

    const isUsingSwap = !areTokensEqual(formValues.fromToken, toToken);
    const toTokensAmountRepaidTokens = isUsingSwap
      ? getSwapToTokenAmountReceivedTokens(swap)
      : fromTokenAmountTokens;

    if (
      toTokensAmountRepaidTokens &&
      fromTokenUserBorrowBalanceTokens &&
      toTokensAmountRepaidTokens.isGreaterThan(fromTokenUserBorrowBalanceTokens)
    ) {
      return 'HIGHER_THAN_REPAY_BALANCE';
    }
  }, [
    fromTokenUserBorrowBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    formValues.amountTokens,
    formValues.fromToken,
    swap,
    swapError,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
