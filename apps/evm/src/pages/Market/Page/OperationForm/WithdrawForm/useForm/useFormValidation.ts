import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';

interface UseFormValidationInput {
  asset: Asset;
  formValues: FormValues;
  limitTokens: BigNumber;
  hypotheticalHealthFactor?: number;
}

interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useFormValidation = ({
  asset,
  limitTokens,
  hypotheticalHealthFactor,
  formValues,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  const formError = useMemo<FormError<FormErrorCode> | undefined>(() => {
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
      hypotheticalHealthFactor !== undefined &&
      hypotheticalHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD &&
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
    hypotheticalHealthFactor,
  ]);

  return {
    isFormValid: !formError,
    formError,
  };
};

export default useFormValidation;
