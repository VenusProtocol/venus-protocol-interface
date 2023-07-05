/** @jsxImportSource @emotion/react */
import { ApproveTokenSteps, ApproveTokenStepsProps, PrimaryButton } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap, SwapError } from 'types';

import { FormError, FormValues } from '../types';

export interface SubmitSectionProps {
  fromToken: FormValues['fromToken'];
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isFormValid: boolean;
  formErrors: FormError[];
  isFromTokenApproved: ApproveTokenStepsProps['isTokenApproved'];
  approveFromToken: ApproveTokenStepsProps['approveToken'];
  isApproveFromTokenLoading: ApproveTokenStepsProps['isApproveTokenLoading'];
  isFromTokenApprovalStatusLoading: ApproveTokenStepsProps['isTokenApprovalStatusLoading'];
  isSwapLoading: boolean;
  swap?: Swap;
  swapError?: SwapError;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  onSubmit,
  isSubmitting,
  fromToken,
  isFormValid,
  isFromTokenApproved,
  approveFromToken,
  isApproveFromTokenLoading,
  isFromTokenApprovalStatusLoading,
  isSwapLoading,
  swapError,
  swap,
  formErrors,
}) => {
  const { t } = useTranslation();

  const submitButtonLabel = useMemo(() => {
    if (formErrors[0] === 'WRAPPING_UNSUPPORTED') {
      return t('swapPage.submitButton.disabledLabels.wrappingUnsupported');
    }

    if (formErrors[0] === 'UNWRAPPING_UNSUPPORTED') {
      return t('swapPage.submitButton.disabledLabels.unwrappingUnsupported');
    }

    if (swapError === 'INSUFFICIENT_LIQUIDITY') {
      return t('swapPage.submitButton.disabledLabels.insufficientLiquidity');
    }

    if (formErrors[0] === 'INVALID_FROM_TOKEN_AMOUNT') {
      return t('swapPage.submitButton.disabledLabels.invalidFromTokenAmount');
    }

    if (formErrors[0] === 'FROM_TOKEN_AMOUNT_HIGHER_THAN_USER_BALANCE') {
      return t('swapPage.submitButton.disabledLabels.insufficientUserBalance', {
        tokenSymbol: fromToken.symbol,
      });
    }

    if (swap) {
      return t('swapPage.submitButton.enabledLabel');
    }

    return t('swapPage.submitButton.processing');
  }, [swap, swapError, formErrors[0]]);

  return (
    <ApproveTokenSteps
      token={fromToken}
      isUsingSwap
      hideTokenEnablingStep={!isFormValid}
      isTokenApproved={isFromTokenApproved}
      approveToken={approveFromToken}
      isApproveTokenLoading={isApproveFromTokenLoading}
      isTokenApprovalStatusLoading={isFromTokenApprovalStatusLoading}
    >
      <PrimaryButton
        fullWidth
        disabled={
          !isFormValid ||
          isSubmitting ||
          isSwapLoading ||
          isApproveFromTokenLoading ||
          isFromTokenApprovalStatusLoading ||
          !isFromTokenApproved
        }
        onClick={onSubmit}
        loading={isSubmitting}
      >
        {submitButtonLabel}
      </PrimaryButton>
    </ApproveTokenSteps>
  );
};

export default SubmitSection;
