import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, Pool, SwapQuote } from 'types';
import type { FormError } from '../../types';
import { useCommonValidation } from '../../useCommonValidation';
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
  }, [
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    formValues.fromToken.symbol,
    formValues.amountTokens,
    t,
    commonFormError,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
