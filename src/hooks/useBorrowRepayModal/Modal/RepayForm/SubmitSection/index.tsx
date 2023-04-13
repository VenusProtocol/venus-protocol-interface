/** @jsxImportSource @emotion/react */
import { EnableTokenSteps, PrimaryButton } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { areTokensEqual, getContractAddress } from 'utilities';

import { FormError } from '../useForm/types';

const swapRouterContractAddress = getContractAddress('swapRouter');

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  toToken: Token;
  fromToken: Token;
  fromTokenAmountTokens: string;
  isSwapLoading: boolean;
  formError?: FormError;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  toToken,
  fromToken,
  fromTokenAmountTokens,
  formError,
  isSwapLoading,
}) => {
  const { t } = useTranslation();

  const submitButtonLabel = useMemo(() => {
    if (isSwapLoading && Number(fromTokenAmountTokens) > 0) {
      return t('borrowRepayModal.repay.submitButtonLabel.processing');
    }

    if (formError === 'SWAP_INSUFFICIENT_LIQUIDITY') {
      return t('borrowRepayModal.repay.submitButtonLabel.insufficientSwapLiquidity');
    }

    if (formError === 'SWAP_WRAPPING_UNSUPPORTED') {
      return t('borrowRepayModal.repay.submitButtonLabel.wrappingUnsupported');
    }

    if (formError === 'SWAP_UNWRAPPING_UNSUPPORTED') {
      return t('borrowRepayModal.repay.submitButtonLabel.unwrappingUnsupported');
    }

    if (formError === 'HIGHER_THAN_REPAY_BALANCE') {
      return t('borrowRepayModal.repay.submitButtonLabel.amountHigherThanRepayBalance');
    }

    if (formError === 'HIGHER_THAN_WALLET_BALANCE') {
      return t('borrowRepayModal.repay.submitButtonLabel.insufficientWalletBalance', {
        tokenSymbol: fromToken.symbol,
      });
    }

    if (!isFormValid) {
      return t('borrowRepayModal.repay.submitButtonLabel.enterValidAmount');
    }

    return t('borrowRepayModal.repay.submitButtonLabel.repay');
  }, [isSwapLoading, fromTokenAmountTokens, isFormValid, formError]);

  return (
    <EnableTokenSteps
      token={fromToken}
      spenderAddress={swapRouterContractAddress}
      submitButtonLabel={t('borrowRepayModal.repay.submitButtonLabel.repay')}
      hideTokenEnablingStep={!isFormValid || areTokensEqual(fromToken, toToken)}
    >
      {({ isTokenApprovalStatusLoading }) => (
        <PrimaryButton
          type="submit"
          loading={isFormSubmitting}
          disabled={
            !isFormValid || isFormSubmitting || isSwapLoading || isTokenApprovalStatusLoading
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
