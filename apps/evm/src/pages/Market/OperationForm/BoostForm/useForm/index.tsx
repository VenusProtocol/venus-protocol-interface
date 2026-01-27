import { handleError } from 'libs/errors';
import type { Asset, Pool, SwapQuote, SwapQuoteError } from 'types';

import type BigNumber from 'bignumber.js';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  borrowedAsset: Asset;
  suppliedAsset: Asset;
  pool: Pool;
  limitTokens: BigNumber;
  onSubmit: () => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  initialFormValues: FormValues;
  swapQuote?: SwapQuote;
  getSwapQuoteError?: SwapQuoteError;
  expectedSuppliedAmountTokens?: BigNumber;
  simulatedPool?: Pool;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formErrors: FormError<FormErrorCode>[];
}

const useForm = ({
  borrowedAsset,
  suppliedAsset,
  pool,
  simulatedPool,
  limitTokens,
  formValues,
  setFormValues,
  initialFormValues,
  expectedSuppliedAmountTokens,
  swapQuote,
  getSwapQuoteError,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formErrors } = useFormValidation({
    borrowedAsset,
    suppliedAsset,
    pool,
    limitTokens,
    simulatedPool,
    formValues,
    swapQuote,
    expectedSuppliedAmountTokens,
    getSwapQuoteError,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      await onSubmit();

      // Reset form
      setFormValues(currentFormValues => ({
        ...initialFormValues,
        suppliedToken: currentFormValues.suppliedToken,
      }));
    } catch (error) {
      handleError({ error });
    }
  };

  return {
    handleSubmit,
    isFormValid,
    formErrors,
  };
};

export default useForm;
