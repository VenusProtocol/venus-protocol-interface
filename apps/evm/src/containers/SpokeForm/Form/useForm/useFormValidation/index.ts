import BigNumber from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import type { AssetBalanceMutation, Pool, TxFormError } from 'types';
import { validatePoolBalanceMutations } from 'utilities';
import type { FormErrorCode, FormValues } from '..';
import { validateCommonCases } from './validateCommonCases';

export interface UseFormValidationInput {
  formValues: FormValues;
  balanceMutations: AssetBalanceMutation[];
  limitTokens: BigNumber;
  pool: Pool;
  simulatedPool?: Pool;
  validate?: (input: { formValues: FormValues }) => TxFormError<FormErrorCode> | undefined;
}

export interface UseFormValidationOutput {
  isFormValid: boolean;
  formError?: TxFormError<FormErrorCode>;
}

export const useFormValidation = ({
  formValues,
  balanceMutations,
  limitTokens,
  pool,
  simulatedPool,
  validate,
}: UseFormValidationInput): UseFormValidationOutput => {
  const { t } = useTranslation();

  let formError: TxFormError<FormErrorCode> | undefined = validate?.({ formValues });

  if (!formError) {
    formError = validatePoolBalanceMutations({
      pool,
      simulatedPool,
      balanceMutations,
      userAcknowledgesRisk: formValues.acknowledgeRisk,
      t,
    });
  }

  if (!formError) {
    const amountTokens = formValues.amountTokens
      ? new BigNumber(formValues.amountTokens)
      : undefined;

    formError = validateCommonCases({ amountTokens, limitTokens, t });
  }

  return {
    isFormValid: !formError,
    formError,
  };
};
