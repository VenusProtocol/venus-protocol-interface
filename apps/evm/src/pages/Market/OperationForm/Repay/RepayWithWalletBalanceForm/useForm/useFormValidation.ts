import BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import { useCommonValidation } from 'pages/Market/OperationForm/useCommonValidation';
import type { AssetBalanceMutation, Pool, SwapQuote } from 'types';
import type { FormError } from '../../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  pool: Pool;
  formValues: FormValues;
  balanceMutations: AssetBalanceMutation[];
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  isFromTokenApproved?: boolean;
  simulatedPool?: Pool;
  swapQuote?: SwapQuote;
  swapQuoteErrorCode?: string;
  isUsingSwap?: boolean;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  pool,
  swapQuote,
  swapQuoteErrorCode,
  formValues,
  balanceMutations,
  isFromTokenApproved,
  simulatedPool,
  fromTokenUserWalletBalanceTokens,
  fromTokenWalletSpendingLimitTokens,
  isUsingSwap,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const commonFormError = useCommonValidation({
    pool,
    simulatedPool,
    swapQuote,
    balanceMutations,
    swapQuoteErrorCode,
    userAcknowledgesHighPriceImpact: true,
  });

  const formError: FormError<FormErrorCode> | undefined = (() => {
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
      SWAP_WRAPPING_UNSUPPORTED: {
        code: 'SWAP_WRAPPING_UNSUPPORTED',
        message: t('operationForm.error.wrappingUnsupported'),
      },
      SWAP_UNWRAPPING_UNSUPPORTED: {
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

    if (
      fromTokenUserWalletBalanceTokens &&
      fromTokenAmountTokens?.isGreaterThan(fromTokenUserWalletBalanceTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_BALANCE',
        message: t('operationForm.error.higherThanWalletBalance', {
          tokenSymbol: formValues.fromToken.symbol,
        }),
      };
    }

    if (
      isFromTokenApproved &&
      fromTokenWalletSpendingLimitTokens &&
      fromTokenAmountTokens?.isGreaterThan(fromTokenWalletSpendingLimitTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('operationForm.error.higherThanWalletSpendingLimit'),
      };
    }

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }
  })();

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
