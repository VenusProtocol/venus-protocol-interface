import BigNumber from 'bignumber.js';

import { handleError, isUserRejectedTxError } from 'libs/errors';
import type { Asset, AssetBalanceMutation, Pool, Swap, SwapError, SwapQuote, Token } from 'types';

import { useAnalytics } from 'libs/analytics';
import { calculateAmountDollars } from '../../calculateAmountDollars';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  pool: Pool;
  balanceMutations: AssetBalanceMutation[];
  onSubmit: (input: {
    fromToken: Token;
    fromTokenAmountTokens: string;
    swap?: Swap;
  }) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  isUsingSwap: boolean;
  simulatedPool?: Pool;
  isFromTokenApproved?: boolean;
  fromTokenWalletSpendingLimitTokens?: BigNumber;
  fromTokenUserWalletBalanceTokens?: BigNumber;
  swap?: Swap; // TODO: remove once swap and supply flow has been implemented
  swapError?: SwapError; // TODO: remove once swap and supply flow has been implemented
  swapQuote?: SwapQuote;
  swapQuoteErrorCode?: string;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useForm = ({
  asset,
  pool,
  simulatedPool,
  balanceMutations,
  fromTokenUserWalletBalanceTokens = new BigNumber(0),
  fromTokenWalletSpendingLimitTokens,
  isFromTokenApproved,
  isUsingSwap,
  swapQuote,
  swap,
  swapError,
  swapQuoteErrorCode,
  formValues,
  setFormValues,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    asset,
    pool,
    simulatedPool,
    balanceMutations,
    formValues,
    swapQuote,
    swap,
    swapError,
    swapQuoteErrorCode,
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
      poolName: pool.name,
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
