import BigNumber from 'bignumber.js';

import { handleError, isUserRejectedTxError } from 'libs/errors';
import type { Asset, SwapQuote, SwapQuoteError, Token } from 'types';

import { useAnalytics } from 'libs/analytics';
import { calculateAmountDollars } from '../../calculateAmountDollars';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  poolName: string;
  onSubmit: (input: {
    fromToken: Token;
    fromTokenAmountTokens: string;
    swap?: SwapQuote;
  }) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  isUsingSwap: boolean;
  onSubmitSuccess?: () => void;
  isFromTokenApproved?: boolean;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  swap?: SwapQuote;
  swapError?: SwapQuoteError;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useForm = ({
  asset,
  poolName,
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
    };

    try {
      captureAnalyticEvent('supply_initiated', analyticData);

      await onSubmit({
        fromTokenAmountTokens: formValues.amountTokens,
        fromToken: formValues.fromToken,
        swap,
      });

      captureAnalyticEvent('supply_signed', analyticData);

      // Reset form and close modal after successfully sending transaction
      setFormValues(() => ({
        fromToken: asset.vToken.underlyingToken,
        amountTokens: '',
      }));
      onSubmitSuccess?.();
    } catch (error) {
      if (isUserRejectedTxError({ error })) {
        captureAnalyticEvent('supply_rejected', analyticData);
      }

      handleError({ error });
    }
  };

  return {
    handleSubmit,
    isFormValid,
    formError,
  };
};

export default useForm;
