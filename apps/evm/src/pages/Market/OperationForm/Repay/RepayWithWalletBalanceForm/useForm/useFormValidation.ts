import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { SwapQuote } from 'types';
import { getSwapToTokenAmountReceivedTokens } from 'utilities/getSwapToTokenAmountReceived';
import type { FormError } from '../../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  formValues: FormValues;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenUserBorrowBalanceTokens?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  isFromTokenApproved?: boolean;
  isUsingSwap: boolean;
  swapQuote?: SwapQuote;
  swapQuoteErrorCode?: string;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  swapQuote,
  swapQuoteErrorCode,
  formValues,
  isFromTokenApproved,
  isUsingSwap,
  fromTokenUserWalletBalanceTokens,
  fromTokenUserBorrowBalanceTokens,
  fromTokenWalletSpendingLimitTokens,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError: FormError<FormErrorCode> | undefined = useMemo(() => {
    const swapErrorMapping: {
      [key: string]: FormError<FormErrorCode>;
    } = {
      INSUFFICIENT_LIQUIDITY: {
        code: 'SWAP_INSUFFICIENT_LIQUIDITY',
        message: t('operationForm.error.insufficientSwapLiquidity'),
      },
      WRAPPING_UNSUPPORTED: {
        code: 'SWAP_WRAPPING_UNSUPPORTED',
        message: t('operationForm.error.wrappingUnsupported'),
      },
      UNWRAPPING_UNSUPPORTED: {
        code: 'SWAP_UNWRAPPING_UNSUPPORTED',
        message: t('operationForm.error.unwrappingUnsupported'),
      },
    };

    if (isUsingSwap && swapQuoteErrorCode && swapQuoteErrorCode in swapErrorMapping) {
      return swapErrorMapping[swapQuoteErrorCode];
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
          tokenSymbol: formValues.fromToken.symbol,
        }),
      };
    }

    const toTokensAmountRepaidTokens = isUsingSwap
      ? getSwapToTokenAmountReceivedTokens(swapQuote)
      : fromTokenAmountTokens;

    if (
      toTokensAmountRepaidTokens &&
      fromTokenUserBorrowBalanceTokens &&
      toTokensAmountRepaidTokens.isGreaterThan(fromTokenUserBorrowBalanceTokens)
    ) {
      return {
        code: 'HIGHER_THAN_REPAY_BALANCE',
        message: t('operationForm.error.higherThanRepayBalance'),
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
      !!swapQuote?.priceImpactPercentage &&
      swapQuote?.priceImpactPercentage >= MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE
    ) {
      return {
        code: 'SWAP_PRICE_IMPACT_TOO_HIGH',
        message: t('operationForm.error.priceImpactTooHigh'),
      };
    }
  }, [
    formValues.fromToken.symbol,
    fromTokenUserBorrowBalanceTokens,
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    isUsingSwap,
    formValues.amountTokens,
    swapQuote,
    swapQuoteErrorCode,
    t,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
