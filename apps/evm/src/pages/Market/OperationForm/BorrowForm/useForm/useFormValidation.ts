import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import type { Asset, AssetBalanceMutation, Pool } from 'types';

import { useTranslation } from 'libs/translations';
import type { FormError } from '../../types';
import { useCommonValidation } from '../../useCommonValidation';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  pool: Pool;
  balanceMutations: AssetBalanceMutation[];
  simulatedPool?: Pool;
  formValues: FormValues;
  limitTokens: BigNumber;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  pool,
  balanceMutations,
  simulatedPool,
  limitTokens,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const commonFormError = useCommonValidation({
    pool,
    simulatedPool,
    balanceMutations,
    userAcknowledgesRisk: formValues.acknowledgeRisk,
  });

  const formError = useMemo<FormError<FormErrorCode> | undefined>(() => {
    if (!pool?.userBorrowLimitCents || pool.userBorrowLimitCents.isEqualTo(0)) {
      return {
        code: 'NO_COLLATERALS',
        message: t('operationForm.error.noCollateral', {
          tokenSymbol: asset.vToken.underlyingToken.symbol,
        }),
      };
    }

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

    if (fromTokenAmountTokens.isGreaterThan(limitTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      };
    }
  }, [asset, pool, commonFormError, limitTokens, formValues.amountTokens, t]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
