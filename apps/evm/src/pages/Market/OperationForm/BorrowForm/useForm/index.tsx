import { handleError, isUserRejectedTxError } from 'libs/errors';
import type { Asset, AssetBalanceMutation, Pool, Token } from 'types';

import type BigNumber from 'bignumber.js';
import { useAnalytics } from 'libs/analytics';
import { calculateAmountDollars } from '../../calculateAmountDollars';
import type { FormError } from '../../types';
import type { FormErrorCode, FormValues } from './types';
import useFormValidation from './useFormValidation';

export * from './types';

export interface UseFormInput {
  asset: Asset;
  pool: Pool;
  limitTokens: BigNumber;
  balanceMutations: AssetBalanceMutation[];
  simulatedPool?: Pool;
  onSubmit: (input: { fromToken: Token; fromTokenAmountTokens: string }) => Promise<unknown>;
  formValues: FormValues;
  setFormValues: (setter: (currentFormValues: FormValues) => FormValues) => void;
  onSubmitSuccess?: () => void;
}

interface UseFormOutput {
  handleSubmit: (e?: React.SyntheticEvent) => Promise<void>;
  isFormValid: boolean;
  formError?: FormError<FormErrorCode>;
}

const useForm = ({
  asset,
  pool,
  limitTokens,
  balanceMutations,
  simulatedPool,
  onSubmitSuccess,
  formValues,
  setFormValues,
  onSubmit,
}: UseFormInput): UseFormOutput => {
  const { isFormValid, formError } = useFormValidation({
    asset,
    pool,
    balanceMutations,
    simulatedPool,
    limitTokens,
    formValues,
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
      captureAnalyticEvent('borrow_initiated', analyticData);

      await onSubmit({
        fromTokenAmountTokens: formValues.amountTokens,
        fromToken: formValues.fromToken,
      });

      captureAnalyticEvent('borrow_signed', analyticData);

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
        captureAnalyticEvent('borrow_rejected', analyticData);
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
