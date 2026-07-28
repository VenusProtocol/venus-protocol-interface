import type BigNumber from 'bignumber.js';

import { handleError } from 'libs/errors';
import type {
  AssetBalanceMutation,
  LiquidityHub,
  LiquidityHubBalanceMutation,
  Pool,
  TxFormError,
} from 'types';
import type {
  LiquidityHubBalanceMutationsErrorCode,
  PoolBalanceMutationsErrorCode,
} from 'utilities';
import { type UseFormValidationInput, useFormValidation } from './useFormValidation';
import type { CommonCasesErrorCode } from './useFormValidation/validateCommonCases';

export interface FormValues {
  amountTokens: string;
  acknowledgeRisk: boolean;
}

export type FormErrorCode =
  | PoolBalanceMutationsErrorCode
  | LiquidityHubBalanceMutationsErrorCode
  | CommonCasesErrorCode
  | 'HIGHER_THAN_WALLET_BALANCE'
  | 'HIGHER_THAN_WALLET_SPENDING_LIMIT';

export const initialFormValues: FormValues = {
  amountTokens: '',
  acknowledgeRisk: false,
};

export interface UseFormInput {
  liquidityHub: LiquidityHub;
  balanceMutations: Array<AssetBalanceMutation | LiquidityHubBalanceMutation>;
  onSubmit: (formValues: FormValues) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  limitTokens: BigNumber;
  pool?: Pool;
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
  liquidityHub,
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
    liquidityHub,
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

      // Reset form after successfully sending transaction
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
