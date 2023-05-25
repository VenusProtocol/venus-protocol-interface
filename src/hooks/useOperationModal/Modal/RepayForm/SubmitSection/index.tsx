/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { EnableTokenSteps, PrimaryButton } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap, Token } from 'types';
import { areTokensEqual, convertWeiToTokens, getContractAddress } from 'utilities';

import TEST_IDS from '../testIds';
import { FormError } from '../useForm/types';
import { useStyles } from './styles';

const swapRouterContractAddress = getContractAddress('swapRouter');

export interface SubmitSectionProps {
  isFormValid: boolean;
  isFormSubmitting: boolean;
  toToken: Token;
  fromToken: Token;
  fromTokenAmountTokens: string;
  isSwapLoading: boolean;
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
  swap,
  isSwapLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

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

  const swapSummary = useMemo(() => {
    if (!swap) {
      return undefined;
    }

    const fromTokenAmountWei =
      swap.direction === 'exactAmountIn'
        ? swap.fromTokenAmountSoldWei
        : swap.expectedFromTokenAmountSoldWei;
    const toTokenAmountWei =
      swap.direction === 'exactAmountIn'
        ? swap.expectedToTokenAmountReceivedWei
        : swap.toTokenAmountReceivedWei;

    const readableFromTokenAmount = convertWeiToTokens({
      valueWei: fromTokenAmountWei,
      token: swap.fromToken,
      returnInReadableFormat: true,
      minimizeDecimals: true,
    });

    const readableToTokenAmount = convertWeiToTokens({
      valueWei: toTokenAmountWei,
      token: swap.toToken,
      returnInReadableFormat: true,
      minimizeDecimals: true,
    });

    return t('operationModal.repay.swapSummary', {
      toTokenAmount: readableToTokenAmount,
      fromTokenAmount: readableFromTokenAmount,
    });
  }, [swap]);

  return (
    <EnableTokenSteps
      token={fromToken}
      spenderAddress={swapRouterContractAddress}
      submitButtonLabel={t('operationModal.repay.submitButtonLabel.repay')}
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

          {swapSummary && (
            <Typography
              data-testid={TEST_IDS.swapSummary}
              css={styles.swapSummary}
              variant="small2"
              component="div"
            >
              {swapSummary}
            </Typography>
          )}
        </>
      )}
    </EnableTokenSteps>
  );
};

export default SubmitSection;
