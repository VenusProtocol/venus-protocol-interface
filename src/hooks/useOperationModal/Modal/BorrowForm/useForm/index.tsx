import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import { useTranslation } from 'translation';
import { Asset, Token } from 'types';
import { convertTokensToWei } from 'utilities';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { FormError, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  limitTokens: string;
  onSubmit: (input: {
    fromToken: Token;
    fromTokenAmountTokens: string;
  }) => Promise<ContractReceipt>;
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
  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const { isFormValid, formError } = useFormValidation({
    asset,
    userBorrowLimitCents,
    limitTokens,
    formValues,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    await handleTransactionMutation({
      mutate: async () => {
        const contractReceipt = await onSubmit({
          fromTokenAmountTokens: formValues.amountTokens,
          fromToken: formValues.fromToken,
        });

        // Reset form and close modal on success only
        setFormValues(() => ({
          fromToken: asset.vToken.underlyingToken,
          amountTokens: '',
        }));
        onCloseModal();

        return contractReceipt;
      },
      successTransactionModalProps: contractReceipt => {
        const amountWei = convertTokensToWei({
          value: new BigNumber(formValues.amountTokens),
          token: asset.vToken.underlyingToken,
        });

        return {
          title: t('operationModal.borrow.successfulTransactionModal.title'),
          content: t('operationModal.borrow.successfulTransactionModal.message'),
          amount: {
            valueWei: amountWei,
            token: asset.vToken.underlyingToken,
          },
          transactionHash: contractReceipt.transactionHash,
        };
      },
    });
  };

  return {
    handleSubmit,
    isFormValid,
    formError,
  };
};

export default useForm;
