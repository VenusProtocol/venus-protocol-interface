/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import { cn } from '@venusprotocol/ui';
import { ApproveTokenSteps, type ApproveTokenStepsProps, PrimaryButton } from 'components';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Swap, SwapError } from 'types';

import { SwitchChain } from 'containers/SwitchChain';
import type { FormError, FormValues } from '../types';
import { useStyles } from './styles';

export interface SubmitSectionProps {
  fromToken: FormValues['fromToken'];
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isFormValid: boolean;
  formErrors: FormError[];
  isFromTokenApproved: ApproveTokenStepsProps['isTokenApproved'];
  approveFromToken: ApproveTokenStepsProps['approveToken'];
  isApproveFromTokenLoading: ApproveTokenStepsProps['isApproveTokenLoading'];
  isFromTokenWalletSpendingLimitLoading: ApproveTokenStepsProps['isWalletSpendingLimitLoading'];
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
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
  isFromTokenWalletSpendingLimitLoading,
  isRevokeFromTokenWalletSpendingLimitLoading,
  isSwapLoading,
  swapError,
  swap,
  formErrors,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const isSwappingWithHighPriceImpact = useMemo(
    () =>
      !!swap?.priceImpactPercentage &&
      swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    [swap?.priceImpactPercentage],
  );

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

    if (formErrors[0] === 'FROM_TOKEN_AMOUNT_HIGHER_THAN_WALLET_SPENDING_LIMIT') {
      return t('swapPage.submitButton.disabledLabels.spendingLimitTooLow');
    }

    if (formErrors[0] === 'PRICE_IMPACT_TOO_HIGH') {
      return t('swapPage.submitButton.disabledLabels.priceImpactHigherThanMaximumTolerated');
    }

    if (isSwappingWithHighPriceImpact) {
      return t('swapPage.submitButton.enabledLabels.swapWithHighPriceImpact');
    }

    if (swap) {
      return t('swapPage.submitButton.enabledLabels.swap');
    }

    return t('swapPage.submitButton.disabledLabels.processing');
  }, [swap, swapError, isSwappingWithHighPriceImpact, formErrors, fromToken.symbol, t]);

  let dom = (
    <PrimaryButton
      className={cn('w-full', isSwappingWithHighPriceImpact && 'border-red bg-red')}
      disabled={
        !isFormValid ||
        isSubmitting ||
        isSwapLoading ||
        isFromTokenWalletSpendingLimitLoading ||
        isRevokeFromTokenWalletSpendingLimitLoading ||
        !isFromTokenApproved
      }
      onClick={onSubmit}
      loading={isSubmitting}
    >
      {submitButtonLabel}
    </PrimaryButton>
  );

  if (isFormValid) {
    dom = (
      <SwitchChain>
        <ApproveTokenSteps
          token={fromToken}
          isTokenApproved={isFromTokenApproved}
          approveToken={approveFromToken}
          isApproveTokenLoading={isApproveFromTokenLoading}
          isWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
          secondStepButtonLabel={submitButtonLabel}
          css={styles.container}
        >
          {dom}
        </ApproveTokenSteps>
      </SwitchChain>
    );
  }

  return dom;
};

export default SubmitSection;
