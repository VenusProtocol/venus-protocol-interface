/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Icon, PrimaryButton, Tooltip, toast } from 'components';
import { VError, formatVErrorToReadableString } from 'errors';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap } from 'types';
import { convertWeiToTokens, getContractAddress } from 'utilities';
import type { TransactionReceipt } from 'web3-core/types';

import { AuthContext } from 'context/AuthContext';
import useTokenApproval from 'hooks/useTokenApproval';

import { FormError, FormValues } from '../types';
import { SwapError } from '../useGetSwapInfo';
import { useStyles } from './styles';

const pancakeRouterContractAddress = getContractAddress('pancakeRouter');

export interface SubmitSectionUiProps extends Omit<SubmitSectionProps, 'fromTokenAmountTokens'> {
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isFromTokenEnabled: boolean | undefined;
  isFromTokenApprovalStatusLoading: boolean;
  enableFromToken: () => Promise<TransactionReceipt | undefined>;
  isEnableFromTokenLoading: boolean;
}

const SubmitSectionUi: React.FC<SubmitSectionUiProps> = ({
  onSubmit,
  isSubmitting,
  fromToken,
  isFromTokenEnabled,
  isFromTokenApprovalStatusLoading,
  enableFromToken,
  isEnableFromTokenLoading,
  isFormValid,
  swapError,
  swap,
  formErrors,
}) => {
  const styles = useStyles();
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
      return t('swapPage.submitButton.enabledLabel', {
        fromTokenAmount: convertWeiToTokens({
          valueWei:
            swap.direction === 'exactAmountIn'
              ? swap.fromTokenAmountSoldWei
              : swap.maximumFromTokenAmountSoldWei,
          token: swap.fromToken,
          returnInReadableFormat: true,
        }),
        toTokenAmount: convertWeiToTokens({
          valueWei:
            swap.direction === 'exactAmountIn'
              ? swap.minimumToTokenAmountReceivedWei
              : swap.toTokenAmountReceivedWei,
          token: swap.toToken,
          returnInReadableFormat: true,
        }),
      });
    }

    return t('swapPage.submitButton.processing');
  }, [swap, swapError, formErrors[0], isFormValid]);

  const handleEnableFromToken = async () => {
    try {
      await enableFromToken();
    } catch (error) {
      let { message } = error as Error;

      if (error instanceof VError) {
        message = formatVErrorToReadableString(error);
      }

      toast.error({
        message,
      });
    }
  };

  const showTokenEnablingStep =
    !isFromTokenApprovalStatusLoading &&
    isFromTokenEnabled === false &&
    !swapError &&
    formErrors.length === 0;

  return (
    <div css={styles.container}>
      {showTokenEnablingStep && (
        <>
          <div css={styles.buttonLabelContainer}>
            <Typography variant="small1" component="label" css={styles.buttonLabel}>
              {t('swapPage.enablingStep.step1')}
            </Typography>

            <Tooltip
              title={t('swapPage.enablingStep.enableTokenButton.tooltip')}
              css={styles.enableTokenTooltip}
            >
              <Icon name="info" />
            </Tooltip>
          </div>

          <PrimaryButton
            fullWidth
            onClick={handleEnableFromToken}
            loading={isEnableFromTokenLoading}
            css={styles.enableTokenButton}
          >
            {t('swapPage.enablingStep.enableTokenButton.text', {
              tokenSymbol: fromToken.symbol,
            })}
          </PrimaryButton>

          <div css={styles.buttonLabelContainer}>
            <Typography variant="small1" component="label" css={styles.buttonLabel}>
              {t('swapPage.enablingStep.step2')}
            </Typography>
          </div>
        </>
      )}

      <PrimaryButton
        fullWidth
        disabled={
          !isFormValid ||
          isEnableFromTokenLoading ||
          isFromTokenApprovalStatusLoading ||
          !isFromTokenEnabled
        }
        onClick={onSubmit}
        loading={isSubmitting}
      >
        {submitButtonLabel}
      </PrimaryButton>
    </div>
  );
};

export interface SubmitSectionProps {
  fromToken: FormValues['fromToken'];
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
  isFormValid: boolean;
  formErrors: FormError[];
  swap?: Swap;
  swapError?: SwapError;
}

const SubmitSection: React.FC<SubmitSectionProps> = ({ fromToken, formErrors, ...otherProps }) => {
  const { account } = React.useContext(AuthContext);

  const {
    isTokenApproved: isFromTokenEnabled,
    approveToken: enableFromToken,
    isApproveTokenLoading: isEnableFromTokenLoading,
    isTokenApprovalStatusLoading: isFromTokenApprovalStatusLoading,
  } = useTokenApproval({
    token: fromToken,
    spenderAddress: pancakeRouterContractAddress,
    accountAddress: account?.address,
  });

  return (
    <SubmitSectionUi
      enableFromToken={enableFromToken}
      isFromTokenEnabled={isFromTokenEnabled}
      isFromTokenApprovalStatusLoading={isFromTokenApprovalStatusLoading}
      isEnableFromTokenLoading={isEnableFromTokenLoading}
      fromToken={fromToken}
      formErrors={formErrors}
      {...otherProps}
    />
  );
};

export default SubmitSection;
