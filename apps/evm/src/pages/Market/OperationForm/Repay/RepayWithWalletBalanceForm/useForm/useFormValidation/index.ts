import BigNumber from 'bignumber.js';

import { useCommonValidation } from 'hooks/useCommonValidation';
import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, Pool, SwapQuote } from 'types';
import type { TxFormError } from 'types';
import type { FormErrorCode, FormValues } from '../types';

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
  formError?: TxFormError<FormErrorCode>;
}

export const useFormValidation = ({
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
    userAcknowledgesHighPriceImpact: formValues.acknowledgeHighPriceImpact,
  });

  const formError: TxFormError<FormErrorCode> | undefined = (() => {
    if (commonFormError) {
      return commonFormError;
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

    if (!simulatedPool || (!swapQuote && isUsingSwap)) {
      return {
        code: 'MISSING_DATA',
      };
    }
  })();

  return {
    isFormValid: !formError,
    formError,
  };
};
