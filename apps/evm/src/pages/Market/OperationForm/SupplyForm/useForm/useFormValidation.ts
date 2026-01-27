import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Asset, SwapQuote, SwapQuoteError } from 'types';
import { formatTokensToReadableValue } from 'utilities';
import { getSwapToTokenAmountReceivedTokens } from 'utilities/getSwapToTokenAmountReceived';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  formValues: FormValues;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  isFromTokenApproved?: boolean;
  isUsingSwap: boolean;
  swap?: SwapQuote;
  swapError?: SwapQuoteError;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  swap,
  swapError,
  formValues,
  isFromTokenApproved,
  isUsingSwap,
  fromTokenUserWalletBalanceTokens,
  fromTokenWalletSpendingLimitTokens,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError: FormError<FormErrorCode> | undefined = useMemo(() => {
    if (isUsingSwap && swapError?.code === 'noSwapQuoteFound') {
      return {
        code: 'NO_SWAP_QUOTE_FOUND',
        message: t('operationForm.error.noSwapQuoteFound'),
      };
    }

    if (
      asset.supplyCapTokens &&
      asset.supplyBalanceTokens.isGreaterThanOrEqualTo(asset.supplyCapTokens)
    ) {
      return {
        code: 'SUPPLY_CAP_ALREADY_REACHED',
        message: t('operationForm.error.supplyCapReached', {
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
        }),
      };
    }

    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    if (
      fromTokenUserWalletBalanceTokens &&
      fromTokenAmountTokens.isGreaterThan(fromTokenUserWalletBalanceTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_BALANCE',
        message: t('operationForm.error.higherThanWalletBalance', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        }),
      };
    }

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
      return {
        code: 'HIGHER_THAN_SUPPLY_CAP',
        message: t('operationForm.error.higherThanSupplyCap', {
          userMaxSupplyAmount: formatTokensToReadableValue({
            value: asset.supplyCapTokens.minus(asset.supplyBalanceTokens),
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
          assetSupplyCap: formatTokensToReadableValue({
            value: asset.supplyCapTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
          assetSupplyBalance: formatTokensToReadableValue({
            value: asset.supplyBalanceTokens,
            token: asset.vToken.underlyingToken,
            maxDecimalPlaces: asset.vToken.underlyingToken.decimals,
          }),
        }),
      };
    }

    if (
      isFromTokenApproved &&
      fromTokenWalletSpendingLimitTokens &&
      fromTokenAmountTokens.isGreaterThan(fromTokenWalletSpendingLimitTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('operationForm.error.higherThanWalletSpendingLimit'),
      };
    }

    if (
      !!swap?.priceImpactPercentage &&
      swap?.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      return {
        code: 'SWAP_PRICE_IMPACT_TOO_HIGH',
        message: t('operationForm.error.priceImpactTooHigh'),
      };
    }
  }, [
    asset,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    isUsingSwap,
    formValues.amountTokens,
    swap,
    swapError,
    t,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
