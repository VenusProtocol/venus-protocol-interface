import { handleError } from 'libs/errors';
import type { Asset, Pool, Token } from 'types';

import type BigNumber from 'bignumber.js';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  pool: Pool;
  limitTokens: BigNumber;
  moderateRiskMaxTokens: BigNumber;
  onSubmit: (input: { fromToken: Token; fromTokenAmountTokens: string }) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  initialFormValues: FormValues;
  onSubmitSuccess?: () => void;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useForm = ({
  asset,
  pool,
  limitTokens,
  moderateRiskMaxTokens,
  onSubmitSuccess,
  formValues,
  setFormValues,
  initialFormValues,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    asset,
    pool,
    limitTokens,
    moderateRiskMaxTokens,
    formValues,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      // TODO: submit form

      // Reset form and close modal on success only
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

export default useForm;
