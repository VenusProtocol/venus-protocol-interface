import type BigNumber from 'bignumber.js';

import { displayMutationError } from 'libs/errors';
import type { Asset, Token } from 'types';

import type { FormError, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  limitTokens: BigNumber;
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
  limitTokens,
  onCloseModal,
  formValues,
  setFormValues,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    limitTokens,
    formValues,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      // TODO: update flow when receiving native token
      await onSubmit({
        fromTokenAmountTokens: formValues.amountTokens,
        fromToken: formValues.fromToken,
      });

      // Reset form and close modal on success only
      setFormValues(() => ({
        fromToken: asset.vToken.underlyingToken,
        amountTokens: '',
        receiveNativeToken: false,
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
