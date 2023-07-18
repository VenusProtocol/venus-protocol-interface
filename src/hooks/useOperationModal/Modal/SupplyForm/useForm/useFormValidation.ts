import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Asset, Swap, SwapError } from 'types';
import { areTokensEqual, convertWeiToTokens } from 'utilities';

import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';

import { FormError, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  formValues: FormValues;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  isFromTokenApproved?: boolean;
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
  isFromTokenApproved,
  fromTokenUserWalletBalanceTokens,
  fromTokenWalletSpendingLimitTokens,
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

    if (
      isFromTokenApproved &&
      fromTokenWalletSpendingLimitTokens &&
      fromTokenAmountTokens.isGreaterThan(fromTokenWalletSpendingLimitTokens)
    ) {
      return 'HIGHER_THAN_WALLET_SPENDING_LIMIT';
    }

    if (
      !!swap?.priceImpactPercentage &&
      swap?.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      return 'PRICE_IMPACT_TOO_HIGH';
    }
  }, [
    asset.vToken.underlyingToken,
    asset.supplyCapTokens,
    asset.supplyBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
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
