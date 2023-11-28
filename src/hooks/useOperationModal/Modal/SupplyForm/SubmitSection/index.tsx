/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';

import { ApproveTokenSteps, ApproveTokenStepsProps, PrimaryButton } from 'components';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'packages/translations';
import { Swap, Token } from 'types';
import { areTokensEqual, cn } from 'utilities';

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

  const isUsingSwap = useMemo(() => !areTokensEqual(fromToken, toToken), [fromToken, toToken]);
  const isSwappingWithHighPriceImpact = useMemo(
    () =>
      !!swap?.priceImpactPercentage &&
      swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    [swap?.priceImpactPercentage],
  );

  const submitButtonLabel = useMemo(() => {
    if (isSwapLoading && Number(fromTokenAmountTokens) > 0) {
      return t('operationModal.supply.submitButtonLabel.processing');
    }

    if (!isFormSubmitting && formError === 'SUPPLY_CAP_ALREADY_REACHED') {
      return t('operationModal.supply.submitButtonLabel.supplyCapReached');
    }

    if (!isFormSubmitting && formError === 'SWAP_INSUFFICIENT_LIQUIDITY') {
      return t('operationModal.supply.submitButtonLabel.insufficientSwapLiquidity');
    }

    if (!isFormSubmitting && formError === 'SWAP_WRAPPING_UNSUPPORTED') {
      return t('operationModal.supply.submitButtonLabel.wrappingUnsupported');
    }

    if (!isFormSubmitting && formError === 'SWAP_UNWRAPPING_UNSUPPORTED') {
      return t('operationModal.supply.submitButtonLabel.unwrappingUnsupported');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_SUPPLY_CAP') {
      return t('operationModal.supply.submitButtonLabel.amountHigherThanSupplyCap');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_WALLET_BALANCE') {
      return t('operationModal.supply.submitButtonLabel.insufficientWalletBalance', {
        tokenSymbol: fromToken.symbol,
      });
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_WALLET_SPENDING_LIMIT') {
      return t('operationModal.supply.submitButtonLabel.amountHigherThanWalletWalletSpendingLimit');
    }

    if (!isFormSubmitting && formError === 'PRICE_IMPACT_TOO_HIGH') {
      return t('operationModal.supply.submitButtonLabel.priceImpactHigherThanMaximumTolerated');
    }

    if (!isFormValid) {
      return t('operationModal.supply.submitButtonLabel.enterValidAmount');
    }

    if (isSwappingWithHighPriceImpact) {
      return t('operationModal.supply.submitButtonLabel.swapAndSupplyWithHighPriceImpact');
    }

    if (isUsingSwap) {
      return t('operationModal.supply.submitButtonLabel.swapAndSupply');
    }

    return t('operationModal.supply.submitButtonLabel.supply');
  }, [
    isSwapLoading,
    fromTokenAmountTokens,
    isFormValid,
    formError,
    isFormSubmitting,
    isSwappingWithHighPriceImpact,
    isUsingSwap,
    fromToken.symbol,
    t,
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
        disabled={
          !isFormValid ||
          isFormSubmitting ||
          isSwapLoading ||
          isApproveFromTokenLoading ||
          isFromTokenWalletSpendingLimitLoading ||
          isRevokeFromTokenWalletSpendingLimitLoading ||
          !isFromTokenApproved
        }
        className={cn('w-full', isSwappingWithHighPriceImpact && 'border-red bg-red')}
      >
        {submitButtonLabel}
      </PrimaryButton>

      {isFormValid && !isSwapLoading && !isFromTokenWalletSpendingLimitLoading && (
        <SwapSummary swap={swap} type="supply" />
      )}
    </ApproveTokenSteps>
  );
};

export default SubmitSection;
