/** @jsxImportSource @emotion/react */
import { ApproveTokenSteps, ApproveTokenStepsProps, PrimaryButton } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap, Token } from 'types';
import { areTokensEqual } from 'utilities';

import SwapSummary from '../../SwapSummary';
import { FormError } from '../useForm/types';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  toToken: Token;
  fromToken: Token;
  fromTokenAmountTokens: string;
  isSwapLoading: boolean;
  isFromTokenApproved: ApproveTokenStepsProps['isTokenApproved'];
  approveFromToken: ApproveTokenStepsProps['approveToken'];
  isApproveFromTokenLoading: ApproveTokenStepsProps['isApproveTokenLoading'];
  isFromWalletSpendingLimitLoading: ApproveTokenStepsProps['isWalletSpendingLimitLoading'];
  swap?: Swap;
  formError?: FormError;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  toToken,
  fromToken,
  fromTokenAmountTokens,
  formError,
  isFromTokenApproved,
  approveFromToken,
  isApproveFromTokenLoading,
  isFromWalletSpendingLimitLoading,
  swap,
  isSwapLoading,
}) => {
  const { t } = useTranslation();

  const isUsingSwap = useMemo(() => !areTokensEqual(fromToken, toToken), [fromToken, toToken]);

  const submitButtonLabel = useMemo(() => {
    if (isSwapLoading && Number(fromTokenAmountTokens) > 0) {
      return t('operationModal.repay.submitButtonLabel.processing');
    }

    if (!isFormSubmitting && formError === 'SWAP_INSUFFICIENT_LIQUIDITY') {
      return t('operationModal.repay.submitButtonLabel.insufficientSwapLiquidity');
    }

    if (!isFormSubmitting && formError === 'SWAP_WRAPPING_UNSUPPORTED') {
      return t('operationModal.repay.submitButtonLabel.wrappingUnsupported');
    }

    if (!isFormSubmitting && formError === 'SWAP_UNWRAPPING_UNSUPPORTED') {
      return t('operationModal.repay.submitButtonLabel.unwrappingUnsupported');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_REPAY_BALANCE') {
      return t('operationModal.repay.submitButtonLabel.amountHigherThanRepayBalance');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_WALLET_BALANCE') {
      return t('operationModal.repay.submitButtonLabel.insufficientWalletBalance', {
        tokenSymbol: fromToken.symbol,
      });
    }

    if (!isFormValid) {
      return t('operationModal.repay.submitButtonLabel.enterValidAmount');
    }

    return t('operationModal.repay.submitButtonLabel.repay');
  }, [isSwapLoading, fromTokenAmountTokens, isFormValid, formError, isFormSubmitting]);

  return (
    <ApproveTokenSteps
      token={fromToken}
      isUsingSwap={isUsingSwap}
      hideTokenEnablingStep={!isFormValid}
      isTokenApproved={isFromTokenApproved}
      approveToken={approveFromToken}
      isApproveTokenLoading={isApproveFromTokenLoading}
      isWalletSpendingLimitLoading={isFromWalletSpendingLimitLoading}
    >
      <PrimaryButton
        type="submit"
        loading={isFormSubmitting}
        disabled={
          !isFormValid ||
          isFormSubmitting ||
          isSwapLoading ||
          isApproveFromTokenLoading ||
          isFromWalletSpendingLimitLoading ||
          !isFromTokenApproved
        }
        fullWidth
      >
        {submitButtonLabel}
      </PrimaryButton>

      {isFormValid && !isSwapLoading && !isFromWalletSpendingLimitLoading && (
        <SwapSummary swap={swap} type="repay" />
      )}
    </ApproveTokenSteps>
  );
};

export default SubmitSection;
