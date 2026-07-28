import BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, LiquidityHub, LiquidityHubBalanceMutation, Pool } from 'types';
import type { TxFormError } from 'types';
import { validateLiquidityHubBalanceMutations, validatePoolBalanceMutations } from 'utilities';
import type { FormErrorCode, FormValues } from '..';
import { validateCommonCases } from './validateCommonCases';

export interface UseFormValidationInput {
  liquidityHub: LiquidityHub;
  formValues: FormValues;
  balanceMutations: Array<LiquidityHubBalanceMutation | AssetBalanceMutation>;
  limitTokens: BigNumber;
  pool?: Pool;
  simulatedPool?: Pool;
  validate?: (input: { formValues: FormValues }) => TxFormError<FormErrorCode> | undefined;
}

export interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: TxFormError<FormErrorCode>;
}

export const useFormValidation = ({
  formValues,
  liquidityHub,
  balanceMutations,
  limitTokens,
  pool,
  simulatedPool,
  validate,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  // Validate liquidity hub balance mutations
  let formError: TxFormError<FormErrorCode> | undefined = validate?.({ formValues });

  if (!formError) {
    formError = validateLiquidityHubBalanceMutations({
      t,
      liquidityHub,
      balanceMutations,
    });
  }

  // Validate pool balance mutations
  if (!formError && pool) {
    formError = validatePoolBalanceMutations({
      pool,
      simulatedPool,
      balanceMutations,
      t,
    });
  }

  // Validate common cases
  if (!formError) {
    const fromTokenAmountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    formError = validateCommonCases({ fromTokenAmountTokens, limitTokens, t });
  }

  return {
    isFormValid: !formError,
    formError,
  };
};
