/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { useAuth } from 'context/AuthContext';
import useTokenApproval from 'hooks/useTokenApproval';

import { PrimaryButton } from '../Button';
import { Icon } from '../Icon';
import { toast } from '../Toast';
import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';

interface ApproveTokenStepsUiProps {
  token: Token;
  approveToken: () => Promise<unknown>;
  isTokenApproved: boolean | undefined;
  isTokenApprovalStatusLoading: boolean;
  isApproveTokenLoading: boolean;
  submitButtonLabel: string;
  children: ({
    isTokenApprovalStatusLoading,
  }: Pick<ApproveTokenStepsUiProps, 'isTokenApprovalStatusLoading'>) => React.ReactNode;
  className?: string;
  hideTokenEnablingStep?: boolean;
}

const ApproveTokenStepsUi: React.FC<ApproveTokenStepsUiProps> = ({
  token,
  approveToken,
  isTokenApproved,
  isTokenApprovalStatusLoading,
  isApproveTokenLoading,
  hideTokenEnablingStep,
  submitButtonLabel,
  className,
  children,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const showChildren = hideTokenEnablingStep || isTokenApprovalStatusLoading || isTokenApproved;

  const handleApproveToken = async () => {
    try {
      await approveToken();
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

  if (showChildren) {
    return <>{children({ isTokenApprovalStatusLoading })}</>;
  }

  return (
    <div className={className}>
      <div css={styles.buttonLabelContainer}>
        <Typography variant="small1" component="label" css={styles.buttonLabel}>
          {t('approveTokenSteps.step1')}
        </Typography>

        <Tooltip
          title={t('approveTokenSteps.approveTokenButton.tooltip')}
          css={styles.approveTokenTooltip}
        >
          <Icon name="info" />
        </Tooltip>
      </div>

      <PrimaryButton
        fullWidth
        onClick={handleApproveToken}
        loading={isApproveTokenLoading}
        css={styles.approveTokenButton}
      >
        {t('approveTokenSteps.approveTokenButton.text', {
          tokenSymbol: token.symbol,
        })}
      </PrimaryButton>

      <div css={styles.buttonLabelContainer}>
        <Typography variant="small1" component="label" css={styles.buttonLabel}>
          {t('approveTokenSteps.step2')}
        </Typography>
      </div>

      <PrimaryButton fullWidth disabled>
        {submitButtonLabel}
      </PrimaryButton>
    </div>
  );
};

export interface ApproveTokenStepsProps
  extends Omit<
    ApproveTokenStepsUiProps,
    'approveToken' | 'isTokenApproved' | 'isTokenApprovalStatusLoading' | 'isApproveTokenLoading'
  > {
  spenderAddress: string;
}

export const ApproveTokenSteps: React.FC<ApproveTokenStepsProps> = ({
  token,
  spenderAddress,
  ...otherProps
}) => {
  const { accountAddress } = useAuth();

  const { isTokenApproved, approveToken, isApproveTokenLoading, isTokenApprovalStatusLoading } =
    useTokenApproval({
      token,
      spenderAddress,
      accountAddress,
    });

  return (
    <ApproveTokenStepsUi
      token={token}
      approveToken={approveToken}
      isTokenApproved={isTokenApproved}
      isTokenApprovalStatusLoading={isTokenApprovalStatusLoading}
      isApproveTokenLoading={isApproveTokenLoading}
      {...otherProps}
    />
  );
};
