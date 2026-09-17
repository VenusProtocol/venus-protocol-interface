import type BigNumber from 'bignumber.js';

import { handleError } from 'libs/errors';
import type { AssetBalanceMutation, Pool, TxFormError } from 'types';
import type { PoolBalanceMutationsErrorCode } from 'utilities';
import { type UseFormValidationInput, useFormValidation } from './useFormValidation';
import type { CommonCasesErrorCode } from './useFormValidation/validateCommonCases';

export interface FormValues {
  amountTokens: string;
  acknowledgeRisk: boolean;
}

export type FormErrorCode =
  | PoolBalanceMutationsErrorCode
  | CommonCasesErrorCode
  | 'ACTION_DISABLED'
  | 'NO_COLLATERAL_SUPPLIED';

export const initialFormValues: FormValues = {
  amountTokens: '',
  acknowledgeRisk: false,
};

export interface UseFormInput {
  pool: Pool;
  balanceMutations: AssetBalanceMutation[];
  onSubmit: (formValues: FormValues) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  limitTokens: BigNumber;
  onSubmitSuccess?: () => void;
  simulatedPool?: Pool;
  validate?: UseFormValidationInput['validate'];
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: TxFormError<FormErrorCode>;
}

export const useForm = ({
  pool,
  simulatedPool,
  balanceMutations,
  formValues,
  setFormValues,
  onSubmit,
  onSubmitSuccess,
  limitTokens,
  validate,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    pool,
    simulatedPool,
    balanceMutations,
    formValues,
    limitTokens,
    validate,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      await onSubmit(formValues);

      setFormValues(() => initialFormValues);

      onSubmitSuccess?.();
    } catch (error) {
      handleError({ error });
    }
  };

  return {
    handleSubmit,
    isFormValid,
    formError,
  };
};
