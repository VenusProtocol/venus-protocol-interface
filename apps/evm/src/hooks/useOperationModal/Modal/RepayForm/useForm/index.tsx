import BigNumber from 'bignumber.js';
import { useEffect } from 'react';

import useIsMounted from 'hooks/useIsMounted';
import { displayMutationError } from 'libs/errors';
import type { Swap, SwapError, Token, VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';

import calculatePercentageOfUserBorrowBalance from '../calculatePercentageOfUserBorrowBalance';
import type { FormError, FormValues } from './types';
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
  }) => Promise<unknown>;
  onCloseModal: () => void;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  fromTokenUserBorrowBalanceTokens?: BigNumber;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  isFromTokenApproved?: boolean;
  isUsingSwap: boolean;
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
  fromTokenWalletSpendingLimitTokens,
  isFromTokenApproved,
  onCloseModal,
  swap,
  swapError,
  formValues,
  setFormValues,
  onSubmit,
  isUsingSwap,
}: UseFormInput): UseFormOutput => {
  const isMounted = useIsMounted();

  const { isFormValid, formError } = useFormValidation({
    formValues,
    swap,
    swapError,
    isFromTokenApproved,
    isUsingSwap,
    fromTokenUserWalletBalanceTokens,
    fromTokenUserBorrowBalanceTokens,
    fromTokenWalletSpendingLimitTokens,
  });

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      await onSubmit({
        toVToken,
        fromTokenAmountTokens: formValues.amountTokens,
        fromToken: formValues.fromToken,
        fixedRepayPercentage: formValues.fixedRepayPercentage,
        swap,
      });

      // Reset form and close modal on success only
      setFormValues(() => ({
        fromToken: toVToken.underlyingToken,
        amountTokens: '',
      }));
      onCloseModal();
    } catch (error) {
      displayMutationError({ error });
    }
  };

  // If user selected a fixed percentage of their loan to repay, we manually
  // update the input value to that exact amount (and keep on updating it when
  // the total loan value changes, for example when interests accumulate)
  useEffect(() => {
    // Fixed percentage without swapping
    if (isMounted() && formValues.fixedRepayPercentage && !isUsingSwap) {
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
    fromTokenUserBorrowBalanceTokens,
    setFormValues,
    isMounted,
    isUsingSwap,
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
      const expectedFromTokenAmountSoldTokens = convertMantissaToTokens({
        value: swap.expectedFromTokenAmountSoldMantissa,
        token: swap.fromToken,
      }).toFixed();

      setFormValues(currentFormValues => ({
        ...currentFormValues,
        amountTokens: expectedFromTokenAmountSoldTokens,
      }));
    }
  }, [formValues.fixedRepayPercentage, swap, setFormValues, isMounted]);

  return {
    handleSubmit,
    isFormValid,
    formError,
  };
};

export default useForm;
