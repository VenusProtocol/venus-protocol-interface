import BigNumber from 'bignumber.js';
import { useEffect } from 'react';

import useIsMounted from 'hooks/useIsMounted';
import { handleError, isUserRejectedTxError } from 'libs/errors';
import type { Asset, Swap, SwapError, Token, VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';

import { useAnalytics } from 'libs/analytics';
import { calculateAmountDollars } from '../../calculateAmountDollars';
import type { FormError } from '../../types';
import calculatePercentageOfUserBorrowBalance from '../calculatePercentageOfUserBorrowBalance';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  poolName: string;
  toVToken: VToken;
  onSubmit: (input: {
    toVToken: VToken;
    fromToken: Token;
    fromTokenAmountTokens: string;
    swap?: Swap;
    fixedRepayPercentage?: number;
  }) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  onSubmitSuccess?: () => void;
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
  formError?: FormError<FormErrorCode>;
}

const useForm = ({
  asset,
  poolName,
  toVToken,
  fromTokenUserWalletBalanceTokens = new BigNumber(0),
  fromTokenUserBorrowBalanceTokens = new BigNumber(0),
  fromTokenWalletSpendingLimitTokens,
  isFromTokenApproved,
  onSubmitSuccess,
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

  const { captureAnalyticEvent } = useAnalytics();

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!isFormValid) {
      return;
    }

    const analyticData = {
      poolName,
      assetSymbol: asset.vToken.underlyingToken.symbol,
      usdAmount: calculateAmountDollars({
        amountTokens: formValues.amountTokens,
        tokenPriceCents: asset.tokenPriceCents,
      }),
      selectedPercentage: formValues.fixedRepayPercentage,
    };

    captureAnalyticEvent('repay_initiated', analyticData);

    try {
      await onSubmit({
        toVToken,
        fromTokenAmountTokens: formValues.amountTokens,
        fromToken: formValues.fromToken,
        fixedRepayPercentage: formValues.fixedRepayPercentage,
        swap,
      });

      captureAnalyticEvent('repay_signed', analyticData);

      // Reset form and close modal on success only
      setFormValues(() => ({
        fromToken: toVToken.underlyingToken,
        amountTokens: '',
      }));

      onSubmitSuccess?.();
    } catch (error) {
      if (isUserRejectedTxError({ error })) {
        captureAnalyticEvent('repay_rejected', analyticData);
      }

      handleError({ error });
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
