import BigNumber from 'bignumber.js';

import { displayMutationError } from 'libs/errors';
import type { Asset, Swap, SwapError, Token } from 'types';

import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';
import type { FormError } from 'containers/OperationForm/types';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  onSubmit: (input: {
    fromToken: Token;
    fromTokenAmountTokens: string;
    swap?: Swap;
  }) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  onSubmitSuccess?: () => void;
  isFromTokenApproved?: boolean;
  isUsingSwap: boolean;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useForm = ({
  asset,
  fromTokenUserWalletBalanceTokens = new BigNumber(0),
  fromTokenWalletSpendingLimitTokens,
  isFromTokenApproved,
  isUsingSwap,
  onSubmitSuccess,
  swap,
  swapError,
  formValues,
  setFormValues,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    asset,
    formValues,
    swap,
    swapError,
    isFromTokenApproved,
    isUsingSwap,
    fromTokenWalletSpendingLimitTokens,
    fromTokenUserWalletBalanceTokens,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      await onSubmit({
        fromTokenAmountTokens: formValues.amountTokens,
        fromToken: formValues.fromToken,
        swap,
      });

      // Reset form and close modal after successfully sending transaction
      setFormValues(() => ({
        fromToken: asset.vToken.underlyingToken,
        amountTokens: '',
      }));
      onSubmitSuccess?.();
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
