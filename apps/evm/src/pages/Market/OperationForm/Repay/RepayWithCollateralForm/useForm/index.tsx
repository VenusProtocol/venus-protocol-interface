import { type VError, handleError } from 'libs/errors';
import type { Asset, Pool, SwapQuote, Token } from 'types';

import type BigNumber from 'bignumber.js';
import type { FormError } from '../../../types';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  limitTokens: BigNumber;
  repaidAsset: Asset;
  onSubmit: (input: { fromToken: Token; fromTokenAmountTokens: string }) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  initialFormValues: FormValues;
  simulatedPool?: Pool;
  swapQuote?: SwapQuote;
  getSwapQuoteError?: VError<'swapQuote' | 'interaction'>;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useForm = ({
  limitTokens,
  formValues,
  setFormValues,
  initialFormValues,
  simulatedPool,
  swapQuote,
  repaidAsset,
  getSwapQuoteError,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    limitTokens,
    formValues,
    simulatedPool,
    swapQuote,
    repaidAsset,
    getSwapQuoteError,
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
