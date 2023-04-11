/** @jsxImportSource @emotion/react */
import { EnableTokenSteps, PrimaryButton } from 'components';
import { FormikErrors } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { areTokensEqual, getContractAddress } from 'utilities';

import { SwapError } from 'hooks/useGetSwapInfo';

import { ErrorCode, FormValues } from '../useForm/validationSchema';

const swapRouterContractAddress = getContractAddress('swapRouter');

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormDirty: boolean;
  isFormSubmitting: boolean;
  toToken: Token;
  fromToken: Token;
  fromTokenAmount: string;
  formErrors: FormikErrors<FormValues>;
  isSwapLoading: boolean;
  swapError?: SwapError;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormDirty,
  isFormSubmitting,
  toToken,
  fromToken,
  fromTokenAmount,
  formErrors,
  isSwapLoading,
  swapError,
}) => {
  const { t } = useTranslation();

  const submitButtonLabel = useMemo(() => {
    if (isSwapLoading && Number(fromTokenAmount) > 0) {
      return t('borrowRepayModal.repay.submitButtonLabel.processing');
    }

    if (!isFormDirty || !Number(fromTokenAmount)) {
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

  return (
    <EnableTokenSteps
      token={fromToken}
      spenderAddress={swapRouterContractAddress}
      submitButtonLabel={t('borrowRepayModal.repay.submitButtonLabel.repay')}
      hideTokenEnablingStep={!isFormValid || !!swapError || areTokensEqual(fromToken, toToken)}
    >
      {({ isTokenApprovalStatusLoading }) => (
        <PrimaryButton
          type="submit"
          loading={isFormSubmitting}
          disabled={
            !isFormValid ||
            !isFormDirty ||
            isFormSubmitting ||
            isSwapLoading ||
            !!swapError ||
            isTokenApprovalStatusLoading
          }
          fullWidth
        >
          {submitButtonLabel}
        </PrimaryButton>

        // TODO: add swap summary if using swap
      )}
    </EnableTokenSteps>
  );
};

export default SubmitSection;
