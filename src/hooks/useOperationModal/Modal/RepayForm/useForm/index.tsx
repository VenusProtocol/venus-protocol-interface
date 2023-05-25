import BigNumber from 'bignumber.js';
import { ContractReceipt } from 'ethers';
import { useEffect } from 'react';
import { useTranslation } from 'translation';
import { Swap, SwapError, Token, VToken } from 'types';
import { areTokensEqual, convertTokensToWei, convertWeiToTokens } from 'utilities';

import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import useIsMounted from 'hooks/useIsMounted';

import calculatePercentageOfUserBorrowBalance from '../calculatePercentageOfUserBorrowBalance';
import { FormError, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  toVToken: VToken;
  onSubmit: (input: {
    toVToken: VToken;
    fromToken: Token;
    fromTokenAmountTokens: string;
    swap?: Swap;
    fixedRepayPercentage?: number;
  }) => Promise<ContractReceipt>;
  onCloseModal: () => void;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  fromTokenUserBorrowBalanceTokens?: BigNumber;
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
  toVToken,
  fromTokenUserWalletBalanceTokens = new BigNumber(0),
  fromTokenUserBorrowBalanceTokens = new BigNumber(0),
  onCloseModal,
  swap,
  swapError,
  formValues,
  setFormValues,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const isMounted = useIsMounted();

  const { t } = useTranslation();
  const handleTransactionMutation = useHandleTransactionMutation();

  const { isFormValid, formError } = useFormValidation({
    toToken: toVToken.underlyingToken,
    formValues,
    swap,
    swapError,
    fromTokenUserWalletBalanceTokens,
    fromTokenUserBorrowBalanceTokens,
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
          toVToken,
          fromTokenAmountTokens: formValues.amountTokens,
          fromToken: formValues.fromToken,
          fixedRepayPercentage: formValues.fixedRepayPercentage,
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
          fromToken: toVToken.underlyingToken,
          amountTokens: '',
        }));
        onCloseModal();

        return contractReceipt;
      },
      successTransactionModalProps: contractReceipt => ({
        title: t('operationModal.repay.successfulTransactionModal.title'),
        content: t('operationModal.repay.successfulTransactionModal.message'),
        amount: {
          valueWei: amountWei,
          token: toVToken.underlyingToken,
        },
        transactionHash: contractReceipt.transactionHash,
      }),
    });
  };

  // If user selected a fixed percentage of their loan to repay, we manually
  // update the input value to that exact amount (and keep on updating it when
  // the total loan value changes, for example when interests accumulate)
  useEffect(() => {
    // Fixed percentage without swapping
    const isNotSwapping = areTokensEqual(formValues.fromToken, toVToken.underlyingToken);

    if (isMounted() && formValues.fixedRepayPercentage && isNotSwapping) {
      const fixedAmountToRepayTokens = calculatePercentageOfUserBorrowBalance({
        userBorrowBalanceTokens: fromTokenUserBorrowBalanceTokens,
        token: formValues.fromToken,
        percentage: formValues.fixedRepayPercentage,
      });

      setFormValues(currentFormValues => ({
        ...currentFormValues,
        amountTokens: fixedAmountToRepayTokens,
      }));
    }
  }, [
    formValues.fixedRepayPercentage,
    formValues.fromToken,
    toVToken.underlyingToken,
    fromTokenUserBorrowBalanceTokens,
    setFormValues,
  ]);

  useEffect(() => {
    // Fixed percentage using the swap
    const isSwapping = !!swap;

    if (
      isMounted() &&
      formValues.fixedRepayPercentage &&
      isSwapping &&
      swap.direction === 'exactAmountOut'
    ) {
      const expectedFromTokenAmountSoldTokens = convertWeiToTokens({
        valueWei: swap.expectedFromTokenAmountSoldWei,
        token: swap.fromToken,
      }).toFixed();

      setFormValues(currentFormValues => ({
        ...currentFormValues,
        amountTokens: expectedFromTokenAmountSoldTokens,
      }));
    }
  }, [formValues.fixedRepayPercentage, swap, setFormValues]);

  return {
    handleSubmit,
    isFormValid,
    formError,
  };
};

export default useForm;
