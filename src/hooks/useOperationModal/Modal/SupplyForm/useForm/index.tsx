import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import { useTranslation } from 'translation';
import { Asset, Swap, SwapError, Token, VToken } from 'types';
import { convertTokensToWei } from 'utilities';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { FormError, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  onSubmit: (input: {
    toVToken: VToken;
    fromToken: Token;
    fromTokenAmountTokens: string;
    swap?: Swap;
  }) => Promise<ContractReceipt>;
  onCloseModal: () => void;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  swap?: Swap;
  swapError?: SwapError;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError;
}

const useForm = ({
  asset,
  fromTokenUserWalletBalanceTokens = new BigNumber(0),
  onCloseModal,
  swap,
  swapError,
  formValues,
  setFormValues,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const { isFormValid, formError } = useFormValidation({
    asset,
    formValues,
    swap,
    swapError,
    fromTokenUserWalletBalanceTokens,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    let amountWei: BigNumber;

    await handleTransactionMutation({
      mutate: async () => {
        const contractReceipt = await onSubmit({
          toVToken: asset.vToken,
          fromTokenAmountTokens: formValues.amountTokens,
          fromToken: formValues.fromToken,
          swap,
        });

        if (swap) {
          amountWei =
            swap?.direction === 'exactAmountIn'
              ? swap.expectedToTokenAmountReceivedWei
              : swap.toTokenAmountReceivedWei;
        } else {
          amountWei = convertTokensToWei({
            value: new BigNumber(formValues.amountTokens.trim()),
            token: formValues.fromToken,
          });
        }

        // Reset form and close modal on success only
        setFormValues(() => ({
          fromToken: asset.vToken.underlyingToken,
          amountTokens: '',
        }));
        onCloseModal();

        return contractReceipt;
      },
      successTransactionModalProps: contractReceipt => ({
        title: t('operationModal.supply.successfulTransactionModal.title'),
        content: t('operationModal.supply.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: asset.vToken.underlyingToken,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  return {
    handleSubmit,
    isFormValid,
    formError,
  };
};

export default useForm;
