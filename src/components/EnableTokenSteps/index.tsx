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

interface EnableTokenStepsUiProps {
  token: Token;
  enableToken: () => Promise<unknown>;
  isTokenEnabled: boolean | undefined;
  isTokenApprovalStatusLoading: boolean;
  isEnableTokenLoading: boolean;
  submitButtonLabel: string;
  children: ({
    isTokenApprovalStatusLoading,
  }: Pick<EnableTokenStepsUiProps, 'isTokenApprovalStatusLoading'>) => React.ReactNode;
  className?: string;
  hideTokenEnablingStep?: boolean;
}

const EnableTokenStepsUi: React.FC<EnableTokenStepsUiProps> = ({
  token,
  enableToken,
  isTokenEnabled,
  isTokenApprovalStatusLoading,
  isEnableTokenLoading,
  hideTokenEnablingStep,
  submitButtonLabel,
  className,
  children,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const showChildren = hideTokenEnablingStep || isTokenApprovalStatusLoading || isTokenEnabled;

  const handleEnableToken = async () => {
    try {
      await enableToken();
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
          {t('enableTokenSteps.step1')}
        </Typography>

        <Tooltip
          title={t('enableTokenSteps.enableTokenButton.tooltip')}
          css={styles.enableTokenTooltip}
        >
          <Icon name="info" />
        </Tooltip>
      </div>

      <PrimaryButton
        fullWidth
        onClick={handleEnableToken}
        loading={isEnableTokenLoading}
        css={styles.enableTokenButton}
      >
        {t('enableTokenSteps.enableTokenButton.text', {
          tokenSymbol: token.symbol,
        })}
      </PrimaryButton>

      <div css={styles.buttonLabelContainer}>
        <Typography variant="small1" component="label" css={styles.buttonLabel}>
          {t('enableTokenSteps.step2')}
        </Typography>
      </div>

      <PrimaryButton fullWidth disabled>
        {submitButtonLabel}
      </PrimaryButton>
    </div>
  );
};

export interface EnableTokenStepsProps
  extends Omit<
    EnableTokenStepsUiProps,
    'enableToken' | 'isTokenEnabled' | 'isTokenApprovalStatusLoading' | 'isEnableTokenLoading'
  > {
  spenderAddress: string;
}

export const EnableTokenSteps: React.FC<EnableTokenStepsProps> = ({
  token,
  spenderAddress,
  ...otherProps
}) => {
  const { accountAddress } = useAuth();

  const {
    isTokenApproved,
    approveToken: enableToken,
    isApproveTokenLoading,
    isTokenApprovalStatusLoading,
  } = useTokenApproval({
    token,
    spenderAddress,
    accountAddress,
  });

  return (
    <EnableTokenStepsUi
      token={token}
      enableToken={enableToken}
      isTokenEnabled={isTokenApproved}
      isTokenApprovalStatusLoading={isTokenApprovalStatusLoading}
      isEnableTokenLoading={isApproveTokenLoading}
      {...otherProps}
    />
  );
};
