import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { Asset, TxFormError } from 'types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  formValues: FormValues;
  limitTokens: BigNumber;
  moderateRiskMaxTokens: BigNumber;
  isRiskyOperation: boolean;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: TxFormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  limitTokens,
  moderateRiskMaxTokens,
  isRiskyOperation,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError = useMemo<TxFormError<FormErrorCode> | undefined>(() => {
    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    if (!fromTokenAmountTokens || fromTokenAmountTokens.isLessThanOrEqualTo(0)) {
      return {
        code: 'EMPTY_TOKEN_AMOUNT',
      };
    }

    const assetLiquidityTokens = new BigNumber(asset.liquidityCents).dividedBy(
      asset.tokenPriceCents,
    );

    if (fromTokenAmountTokens.isGreaterThan(assetLiquidityTokens)) {
      // User is trying to withdraw more than available liquidity
      return {
        code: 'HIGHER_THAN_LIQUIDITY',
        message: t('operationForm.error.higherThanAvailableLiquidity'),
      };
    }

    if (fromTokenAmountTokens.isGreaterThan(limitTokens)) {
      return {
        code: 'HIGHER_THAN_AVAILABLE_AMOUNT',
        message: t('operationForm.error.higherThanAvailableAmount'),
      };
    }

    if (
      (fromTokenAmountTokens.isGreaterThan(moderateRiskMaxTokens) || isRiskyOperation) &&
      !formValues.acknowledgeRisk
    ) {
      return {
        code: 'REQUIRES_RISK_ACKNOWLEDGEMENT',
      };
    }
  }, [
    limitTokens,
    formValues.amountTokens,
    formValues.acknowledgeRisk,
    t,
    asset,
    moderateRiskMaxTokens,
    isRiskyOperation,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
