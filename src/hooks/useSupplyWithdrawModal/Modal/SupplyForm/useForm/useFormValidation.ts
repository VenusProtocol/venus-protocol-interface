import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset, Swap, SwapError } from 'types';
import { areTokensEqual, convertWeiToTokens } from 'utilities';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  formValues: FormValues;
  fromTokenUserWalletBalanceTokens?: BigNumber;
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
  asset,
  swap,
  swapError,
  formValues,
  fromTokenUserWalletBalanceTokens,
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

    if (
      asset.supplyCapTokens &&
      asset.supplyBalanceTokens.isGreaterThanOrEqualTo(asset.supplyCapTokens)
    ) {
      return 'SUPPLY_CAP_ALREADY_REACHED';
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

    const isUsingSwap = !areTokensEqual(formValues.fromToken, asset.vToken.underlyingToken);
    const toTokensAmountSuppliedTokens = isUsingSwap
      ? getSwapToTokenAmountReceivedTokens(swap)
      : fromTokenAmountTokens;

    if (
      toTokensAmountSuppliedTokens &&
      asset.supplyCapTokens &&
      asset.supplyBalanceTokens
        .plus(toTokensAmountSuppliedTokens)
        .isGreaterThan(asset.supplyCapTokens)
    ) {
      return 'HIGHER_THAN_SUPPLY_CAP';
    }
  }, [
    asset.vToken.underlyingToken,
    asset.supplyCapTokens,
    asset.supplyBalanceTokens,
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
