import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

import type { FormError, FormValues } from '../types';

interface UseFormValidationInput {
  formValues: FormValues;
  availableTokens: BigNumber;
  token: Token;
  maxDepositCapacityTokens: BigNumber;
  minRequestTokens: BigNumber;
  isDepositWindowClosed: boolean;
  isStake: boolean;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError;
}

const useFormValidation = ({
  formValues,
  availableTokens,
  token,
  maxDepositCapacityTokens,
  minRequestTokens,
  isDepositWindowClosed,
  isStake,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError: FormError | undefined = useMemo(() => {
    if (isStake && isDepositWindowClosed) {
      return {
        code: 'DEPOSIT_WINDOW_CLOSED',
        message: t('vault.modals.error.depositWindowClosed'),
      };
    }

    const tokenAmount = formValues.tokenAmount ? new BigNumber(formValues.tokenAmount) : undefined;

    if (tokenAmount && availableTokens && tokenAmount.isGreaterThan(availableTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE',
        message: t('vault.modals.error.higherThanAvailable', {
          tokenSymbol: token.symbol,
        }),
      };
    }

    if (
      isStake &&
      tokenAmount &&
      maxDepositCapacityTokens.isGreaterThan(0) &&
      tokenAmount.isGreaterThan(maxDepositCapacityTokens)
    ) {
      return {
        code: 'HIGHER_THAN_MAX_DEPOSIT',
        message: t('vault.modals.error.higherThanMaxDeposit'),
      };
    }

    if (
      isStake &&
      tokenAmount &&
      minRequestTokens.isGreaterThan(0) &&
      tokenAmount.isLessThan(minRequestTokens)
    ) {
      return {
        code: 'LOWER_THAN_MIN_REQUEST',
        message: t('vault.modals.error.lowerThanMinRequest', {
          amount: minRequestTokens.toFixed(),
          tokenSymbol: token.symbol,
        }),
      };
    }

    if (tokenAmount && (tokenAmount.isNaN() || tokenAmount.isLessThanOrEqualTo(0))) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
        message: t('vault.modals.error.invalidAmount'),
      };
    }

    if (!tokenAmount) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }
  }, [
    formValues.tokenAmount,
    availableTokens,
    token.symbol,
    maxDepositCapacityTokens,
    minRequestTokens,
    isDepositWindowClosed,
    isStake,
    t,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
