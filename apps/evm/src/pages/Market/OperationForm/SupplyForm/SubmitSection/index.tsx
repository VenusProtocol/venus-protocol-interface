/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import { cn } from '@venusprotocol/ui';
import { ApproveTokenSteps, type ApproveTokenStepsProps, PrimaryButton } from 'components';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Swap, SwapQuote, Token } from 'types';

import { SwitchChain } from 'containers/SwitchChain';
import SwapSummary from '../../SwapSummary';
import type { FormError } from '../../types';
import type { FormErrorCode } from '../useForm/types';

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  fromToken: Token;
  fromTokenAmountTokens: string;
  isSwapLoading: boolean;
  isFromTokenApproved: ApproveTokenStepsProps['isTokenApproved'];
  approveFromToken: ApproveTokenStepsProps['approveToken'];
  isApproveFromTokenLoading: ApproveTokenStepsProps['isApproveTokenLoading'];
  isFromTokenWalletSpendingLimitLoading: ApproveTokenStepsProps['isWalletSpendingLimitLoading'];
  isRevokeFromTokenWalletSpendingLimitLoading: boolean;
  swap?: Swap | SwapQuote;
  formError?: FormError<FormErrorCode>;
  isUsingSwap: boolean;
}

export const SubmitSection: React.FC<SubmitSectionProps> = ({
  isFormValid,
  isFormSubmitting,
  fromToken,
  isFromTokenApproved,
  approveFromToken,
  isApproveFromTokenLoading,
  isFromTokenWalletSpendingLimitLoading,
  isRevokeFromTokenWalletSpendingLimitLoading,
  swap,
  isSwapLoading,
  isUsingSwap,
}) => {
  const { t } = useTranslation();

  const isSwappingWithHighPriceImpact = useMemo(
    () =>
      !!swap?.priceImpactPercentage &&
      swap?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
    [swap?.priceImpactPercentage],
  );

  const submitButtonLabel = useMemo(() => {
    if (!isFormValid) {
      return t('operationForm.submitButtonLabel.enterValidAmount');
    }

    return t('operationForm.submitButtonLabel.supply');
  }, [isFormValid, t]);

  let dom = (
    <>
      <PrimaryButton
        type="submit"
        loading={isFormSubmitting}
        disabled={
          !isFormValid ||
          isFormSubmitting ||
          isSwapLoading ||
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
    </>
  );

  if (isFormValid) {
    dom = (
      <SwitchChain>
        <ApproveTokenSteps
          token={fromToken}
          isUsingSwap={isUsingSwap}
          isTokenApproved={isFromTokenApproved}
          approveToken={approveFromToken}
          isApproveTokenLoading={isApproveFromTokenLoading}
          isWalletSpendingLimitLoading={isFromTokenWalletSpendingLimitLoading}
          secondStepButtonLabel={submitButtonLabel}
        >
          {dom}
        </ApproveTokenSteps>
      </SwitchChain>
    );
  }

  return dom;
};

export default SubmitSection;
