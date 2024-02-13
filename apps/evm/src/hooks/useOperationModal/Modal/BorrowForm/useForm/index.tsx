import { displayMutationError } from 'libs/errors';

import { Asset, Token } from 'types';

import { FormError, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  limitTokens: string;
  onSubmit: (input: { fromToken: Token; fromTokenAmountTokens: string }) => Promise<unknown>;
  onCloseModal: () => void;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  userBorrowLimitCents?: number;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError;
}

const useForm = ({
  asset,
  userBorrowLimitCents = 0,
  limitTokens,
  onCloseModal,
  formValues,
  setFormValues,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    asset,
    userBorrowLimitCents,
    limitTokens,
    formValues,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    try {
      await onSubmit({
        fromTokenAmountTokens: formValues.amountTokens,
        fromToken: formValues.fromToken,
      });

      // Reset form and close modal on success only
      setFormValues(() => ({
        fromToken: asset.vToken.underlyingToken,
        amountTokens: '',
      }));
      onCloseModal();
    } catch (error) {
      displayMutationError({ error });
    }
  };

  return {
    handleSubmit,
    isFormValid,
    formError,
  };
};

export default useForm;
