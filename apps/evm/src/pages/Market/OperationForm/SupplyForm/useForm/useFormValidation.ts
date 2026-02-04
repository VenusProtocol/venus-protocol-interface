import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Asset, AssetBalanceMutation, Pool, Swap, SwapError, SwapQuote } from 'types';
import type { FormError } from '../../types';
import { useCommonValidation } from '../../useCommonValidation';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  pool: Pool;
  formValues: FormValues;
  balanceMutations: AssetBalanceMutation[];
  isUsingSwap: boolean;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  isFromTokenApproved?: boolean;
  simulatedPool?: Pool;
  swap?: Swap; // TODO: remove once swap and supply flow has been implemented
  swapError?: SwapError; // TODO: remove once swap and supply flow has been implemented
  swapQuote?: SwapQuote;
  swapQuoteErrorCode?: string;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  pool,
  swapQuote,
  swapQuoteErrorCode,
  swap,
  swapError,
  formValues,
  balanceMutations,
  isFromTokenApproved,
  isUsingSwap,
  simulatedPool,
  fromTokenUserWalletBalanceTokens,
  fromTokenWalletSpendingLimitTokens,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const commonFormError = useCommonValidation({
    pool,
    simulatedPool,
    swapQuote,
    balanceMutations,
    swapQuoteErrorCode,
  });

  const formError: FormError<FormErrorCode> | undefined = useMemo(() => {
    if (commonFormError) {
      return commonFormError;
    }

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

    if (isUsingSwap && swapError && swapError in swapErrorMapping) {
      return swapErrorMapping[swapError];
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

    // TODO: remove once swap and supply flow has been implemented, this case is already covered by
    // the useCommonValidation hook
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
    commonFormError,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
