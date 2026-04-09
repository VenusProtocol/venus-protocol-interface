import type BigNumber from 'bignumber.js';

import { handleError } from 'libs/errors';
import type { Token } from 'types';

import type { PendleSwapQuoteError } from 'clients/api';
import type { FormError, FormValues } from './types';
import useFormValidation from './useFormValidation';

export type { FormValues, FormError, FormErrorCode } from './types';

export interface UseFormInput {
  onSubmit: () => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (current: FormValues) => FormValues) => void;
  swapQuoteError?: PendleSwapQuoteError;
  availableTokens: BigNumber;
  token: Token;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError;
}

export const useForm = ({
  onSubmit,
  formValues,
  setFormValues,
  swapQuoteError,
  availableTokens,
  token,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    formValues,
    availableTokens,
    swapQuoteError,
    token,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      await onSubmit();

      // Reset form after successful submission
      setFormValues(prev => ({ ...prev, tokenAmount: '' }));
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
