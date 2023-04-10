/** @jsxImportSource @emotion/react */
import { PrimaryButton } from 'components';
import { FormikErrors } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { SwapError } from 'hooks/useGetSwapInfo';

import { ErrorCode, FormValues } from '../useForm/validationSchema';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormDirty: boolean;
  isFormSubmitting: boolean;
  isSwapLoading: boolean;
  fromToken: Token;
  fromTokenAmount: string;
  formErrors: FormikErrors<FormValues>;
  swapError?: SwapError;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormDirty,
  isFormSubmitting,
  isSwapLoading,
  fromToken,
  fromTokenAmount,
  formErrors,
  swapError,
}) => {
  const { t } = useTranslation();

  const submitButtonLabel = useMemo(() => {
    if (isSwapLoading && Number(fromTokenAmount) > 0) {
      return t('borrowRepayModal.repay.submitButtonLabel.processing');
    }

    if (!isFormDirty || !fromTokenAmount) {
      return t('borrowRepayModal.repay.submitButtonLabel.enterValidAmount');
    }

    if (formErrors.amountTokens === ErrorCode.HIGHER_THAN_REPAY_BALANCE) {
      return t('borrowRepayModal.repay.submitButtonLabel.amountHigherThanRepayBalance');
    }

    if (formErrors.amountTokens === ErrorCode.HIGHER_THAN_WALLET_BALANCE) {
      return t('borrowRepayModal.repay.submitButtonLabel.insufficientWalletBalance', {
        tokenSymbol: fromToken.symbol,
      });
    }

    if (swapError === 'INSUFFICIENT_LIQUIDITY') {
      return t('borrowRepayModal.repay.submitButtonLabel.insufficientSwapLiquidity');
    }

    if (swapError === 'WRAPPING_UNSUPPORTED') {
      return t('borrowRepayModal.repay.submitButtonLabel.wrappingUnsupported');
    }

    if (swapError === 'UNWRAPPING_UNSUPPORTED') {
      return t('borrowRepayModal.repay.submitButtonLabel.unwrappingUnsupported');
    }

    if (!isFormValid) {
      return t('borrowRepayModal.repay.submitButtonLabel.enterValidAmount');
    }

    return t('borrowRepayModal.repay.submitButtonLabel.repay');
  }, [isFormDirty, isSwapLoading, formErrors.amountTokens, fromTokenAmount]);

  // TODO: handle enable flow

  return (
    <PrimaryButton
      type="submit"
      loading={isFormSubmitting}
      disabled={!isFormValid || !isFormDirty || isFormSubmitting || isSwapLoading || !!swapError}
      fullWidth
    >
      {submitButtonLabel}
    </PrimaryButton>

    // TODO: add footer when swapping
  );
};

export default SubmitSection;
