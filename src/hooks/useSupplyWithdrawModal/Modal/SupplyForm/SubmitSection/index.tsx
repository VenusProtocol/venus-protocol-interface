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
      return t('supplyWithdrawModal.supply.submitButtonLabel.processing');
    }

    if (!isFormSubmitting && formError === 'SUPPLY_CAP_ALREADY_REACHED') {
      return t('supplyWithdrawModal.supply.submitButtonLabel.supplyCapReached');
    }

    if (!isFormSubmitting && formError === 'SWAP_INSUFFICIENT_LIQUIDITY') {
      return t('supplyWithdrawModal.supply.submitButtonLabel.insufficientSwapLiquidity');
    }

    if (!isFormSubmitting && formError === 'SWAP_WRAPPING_UNSUPPORTED') {
      return t('supplyWithdrawModal.supply.submitButtonLabel.wrappingUnsupported');
    }

    if (!isFormSubmitting && formError === 'SWAP_UNWRAPPING_UNSUPPORTED') {
      return t('supplyWithdrawModal.supply.submitButtonLabel.unwrappingUnsupported');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_SUPPLY_CAP') {
      return t('supplyWithdrawModal.supply.submitButtonLabel.amountHigherThanSupplyCap');
    }

    if (!isFormSubmitting && formError === 'HIGHER_THAN_WALLET_BALANCE') {
      return t('supplyWithdrawModal.supply.submitButtonLabel.insufficientWalletBalance', {
        tokenSymbol: fromToken.symbol,
      });
    }

    if (!isFormValid) {
      return t('supplyWithdrawModal.supply.submitButtonLabel.enterValidAmount');
    }

    return t('supplyWithdrawModal.supply.submitButtonLabel.supply');
  }, [isSwapLoading, fromTokenAmountTokens, isFormValid, formError, isFormSubmitting]);

  return (
    <EnableTokenSteps
      token={fromToken}
      spenderAddress={swapRouterContractAddress}
      submitButtonLabel={t('supplyWithdrawModal.supply.submitButtonLabel.supply')}
      hideTokenEnablingStep={!isFormValid || areTokensEqual(fromToken, toToken)}
    >
      {({ isTokenApprovalStatusLoading }) => (
        <>
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
        </>
      )}
    </EnableTokenSteps>
  );
};

export default SubmitSection;
