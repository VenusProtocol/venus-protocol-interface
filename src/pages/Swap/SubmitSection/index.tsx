/** @jsxImportSource @emotion/react */
import { ApproveTokenSteps, PrimaryButton } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap, SwapError } from 'types';
import { getContractAddress } from 'utilities';

import { FormError, FormValues } from '../types';

const swapRouterContractAddress = getContractAddress('swapRouter');

export interface SubmitSectionProps {
  fromToken: FormValues['fromToken'];
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isFormValid: boolean;
  formErrors: FormError[];
  swap?: Swap;
  swapError?: SwapError;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({
  onSubmit,
  isSubmitting,
  fromToken,
  isFormValid,
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
      spenderAddress={swapRouterContractAddress}
      submitButtonLabel={t('swapPage.submitButton.enabledLabel')}
      hideTokenEnablingStep={!isFormValid}
    >
      {({ isTokenApprovalStatusLoading }) => (
        <PrimaryButton
          fullWidth
          disabled={!isFormValid || isTokenApprovalStatusLoading}
          onClick={onSubmit}
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </PrimaryButton>
      )}
    </ApproveTokenSteps>
  );
};

export default SubmitSection;
