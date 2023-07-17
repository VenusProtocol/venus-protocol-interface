/** @jsxImportSource @emotion/react */
import { ApproveTokenSteps, ApproveTokenStepsProps, PrimaryButton } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap, Token } from 'types';
import { areTokensEqual } from 'utilities';

import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';

import SwapSummary from '../../SwapSummary';
import { useStyles as useSharedStyles } from '../../styles';
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
  isFromTokenWalletSpendingLimitLoading: ApproveTokenStepsProps['isWalletSpendingLimitLoading'];
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
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
  isFromTokenWalletSpendingLimitLoading,
  isRevokeFromTokenWalletSpendingLimitLoading,
  swap,
  isSwapLoading,
}) => {
  const { t } = useTranslation();
  const styles = useSharedStyles();

  const isUsingSwap = useMemo(() => !areTokensEqual(fromToken, toToken), [fromToken, toToken]);
  const isSwappingWithHighPriceImpact = useMemo(
    () =>
      !!swap?.priceImpactPercentage &&
      swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    [swap?.priceImpactPercentage],
  );

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

    if (!isFormSubmitting && formError === 'HIGHER_THAN_WALLET_SPENDING_LIMIT') {
      return t('operationModal.repay.submitButtonLabel.amountHigherThanWalletWalletSpendingLimit');
    }

    if (!isFormSubmitting && formError === 'PRICE_IMPACT_TOO_HIGH') {
      return t('operationModal.repay.submitButtonLabel.priceImpactHigherThanMaximumTolerated');
    }

    if (!isFormValid) {
      return t('operationModal.repay.submitButtonLabel.enterValidAmount');
    }

    if (isSwappingWithHighPriceImpact) {
      return t('operationModal.repay.submitButtonLabel.swapAndRepayWithHighPriceImpact');
    }

    if (isUsingSwap) {
      return t('operationModal.repay.submitButtonLabel.swapAndRepay');
    }

    return t('operationModal.repay.submitButtonLabel.repay');
  }, [
    isSwapLoading,
    fromTokenAmountTokens,
    isFormValid,
    formError,
    isFormSubmitting,
    isUsingSwap,
    isSwappingWithHighPriceImpact,
  ]);

  return (
    <ApproveTokenSteps
      token={fromToken}
      isUsingSwap={isUsingSwap}
      hideTokenEnablingStep={!isFormValid}
      isTokenApproved={isFromTokenApproved}
      approveToken={approveFromToken}
      isApproveTokenLoading={isApproveFromTokenLoading}
      isWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
    >
      <PrimaryButton
        type="submit"
        loading={isFormSubmitting}
        css={styles.getSubmitButton({ isDangerous: isSwappingWithHighPriceImpact })}
        disabled={
          !isFormValid ||
          isFormSubmitting ||
          isSwapLoading ||
          isApproveFromTokenLoading ||
          isFromTokenWalletSpendingLimitLoading ||
          isRevokeFromTokenWalletSpendingLimitLoading ||
          !isFromTokenApproved
        }
        fullWidth
      >
        {submitButtonLabel}
      </PrimaryButton>

      {isFormValid && !isSwapLoading && !isFromTokenWalletSpendingLimitLoading && (
        <SwapSummary swap={swap} type="repay" />
      )}
    </ApproveTokenSteps>
  );
};

export default SubmitSection;
