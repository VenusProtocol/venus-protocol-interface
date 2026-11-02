import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, Pool, SwapQuote } from 'types';
import type { TxFormError } from 'types';
import { validatePoolBalanceMutations } from 'utilities';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  pool: Pool;
  formValues: FormValues;
  balanceMutations: AssetBalanceMutation[];
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  isFromTokenApproved?: boolean;
  liquidityHubLimitTokens?: BigNumber;
  simulatedPool?: Pool;
  swapQuote?: SwapQuote;
  swapQuoteErrorCode?: string;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: TxFormError<FormErrorCode>;
}

const useFormValidation = ({
  pool,
  swapQuote,
  swapQuoteErrorCode,
  formValues,
  balanceMutations,
  isFromTokenApproved,
  liquidityHubLimitTokens,
  simulatedPool,
  fromTokenUserWalletBalanceTokens,
  fromTokenWalletSpendingLimitTokens,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const commonFormError = validatePoolBalanceMutations({
    t,
    pool,
    simulatedPool,
    balanceMutations,
    swapPriceImpactPercentage: swapQuote?.priceImpactPercentage,
    swapQuoteErrorCode,
    userAcknowledgesHighPriceImpact: formValues.acknowledgeHighPriceImpact,
  });

  const formError: TxFormError<FormErrorCode> | undefined = useMemo(() => {
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
        message: t('marketForm.error.higherThanWalletBalance', {
          tokenSymbol: formValues.fromToken.symbol,
        }),
      };
    }

    if (liquidityHubLimitTokens && fromTokenAmountTokens.isGreaterThan(liquidityHubLimitTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('marketForm.error.higherThanAvailableAmount'),
      };
    }

    if (
      isFromTokenApproved &&
      fromTokenWalletSpendingLimitTokens &&
      fromTokenAmountTokens.isGreaterThan(fromTokenWalletSpendingLimitTokens)
    ) {
      return {
        code: 'HIGHER_THAN_WALLET_SPENDING_LIMIT',
        message: t('marketForm.error.higherThanWalletSpendingLimit'),
      };
    }
  }, [
    fromTokenUserWalletBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
    isFromTokenApproved,
    liquidityHubLimitTokens,
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
