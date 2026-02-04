import { handleError } from 'libs/errors';
import type { Asset, Pool, SwapQuote, SwapQuoteError } from 'types';

import type BigNumber from 'bignumber.js';
import useIsMounted from 'hooks/useIsMounted';
import { useEffect } from 'react';
import { areTokensEqual, convertMantissaToTokens } from 'utilities';
import type { FormError } from '../../../types';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  limitTokens: BigNumber;
  repaidAsset: Asset;
  onSubmit: () => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  initialFormValues: FormValues;
  isUsingSwap: boolean;
  simulatedPool?: Pool;
  swapQuote?: SwapQuote;
  getSwapQuoteError?: SwapQuoteError;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formErrors: FormError<FormErrorCode>[];
}

const useForm = ({
  limitTokens,
  formValues,
  setFormValues,
  onSubmit,
  initialFormValues,
  simulatedPool,
  swapQuote,
  repaidAsset,
  getSwapQuoteError,
  isUsingSwap,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formErrors } = useFormValidation({
    limitTokens,
    formValues,
    simulatedPool,
    swapQuote,
    repaidAsset,
    getSwapQuoteError,
    isUsingSwap,
  });
  const isMounted = useIsMounted();

  // Automatically update form values when using swap
  useEffect(() => {
    if (isMounted() && swapQuote?.direction === 'exact-in') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        repaidAmountTokens: convertMantissaToTokens({
          value: swapQuote.expectedToTokenAmountReceivedMantissa,
          token: swapQuote.toToken,
        }).toFixed(),
      }));
    } else if (isMounted() && swapQuote?.direction === 'approximate-out') {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        collateralAmountTokens: convertMantissaToTokens({
          value: swapQuote.fromTokenAmountSoldMantissa,
          token: swapQuote.fromToken,
        }).toFixed(),
      }));
    }
  }, [swapQuote, setFormValues, isMounted]);

  // If user clicked on max button, we manually update the repaid input value to that exact amount
  // (and keep on updating it when the total loan value changes, for example when interests
  // accumulate)
  useEffect(() => {
    if (isMounted() && formValues.repayFullLoan) {
      setFormValues(currentFormValues => ({
        ...currentFormValues,
        collateralAmountTokens: areTokensEqual(
          currentFormValues.collateralToken,
          repaidAsset.vToken.underlyingToken,
        )
          ? repaidAsset.userBorrowBalanceTokens.toFixed()
          : currentFormValues.collateralAmountTokens,
        repaidAmountTokens: repaidAsset.userBorrowBalanceTokens.toFixed(),
      }));
    }
  }, [formValues.repayFullLoan, repaidAsset, setFormValues, isMounted]);

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
        collateralToken: currentFormValues.collateralToken,
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
