import type BigNumber from 'bignumber.js';

import { useAnalytics } from 'libs/analytics';
import { handleError, isUserRejectedTxError } from 'libs/errors';
import type { Asset, Token } from 'types';
import { calculateAmountDollars } from '../../calculateAmountDollars';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  poolName: string;
  limitTokens: BigNumber;
  moderateRiskMaxTokens: BigNumber;
  onSubmit: (input: { fromToken: Token; fromTokenAmountTokens: string }) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues | FormValues) => void;
  userBorrowLimitCents?: number;
  onSubmitSuccess?: () => void;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useForm = ({
  asset,
  poolName,
  limitTokens,
  moderateRiskMaxTokens,
  onSubmitSuccess,
  formValues,
  setFormValues,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    asset,
    limitTokens,
    moderateRiskMaxTokens,
    formValues,
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
      captureAnalyticEvent('withdraw_initiated', analyticData);

      await onSubmit({
        fromTokenAmountTokens: formValues.amountTokens,
        fromToken: formValues.fromToken,
      });

      captureAnalyticEvent('withdraw_signed', analyticData);

      // Reset form and close modal on success only
      setFormValues(() => ({
        fromToken: asset.vToken.underlyingToken,
        amountTokens: '',
        receiveNativeToken: !!asset.vToken.underlyingToken.tokenWrapped,
        acknowledgeRisk: false,
      }));

      onSubmitSuccess?.();
    } catch (error) {
      if (isUserRejectedTxError({ error })) {
        captureAnalyticEvent('withdraw_rejected', analyticData);
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
