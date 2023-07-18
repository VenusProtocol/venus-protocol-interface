/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { VError, formatVErrorToReadableString } from 'errors';
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { PrimaryButton } from '../Button';
import { Icon } from '../Icon';
import { toast } from '../Toast';
import { Tooltip } from '../Tooltip';
import { useStyles } from './styles';

export interface ApproveTokenStepsProps {
  token: Token;
  approveToken: () => Promise<unknown>;
  isTokenApproved: boolean | undefined;
  isWalletSpendingLimitLoading: boolean;
  isApproveTokenLoading: boolean;
  children: React.ReactNode;
  isUsingSwap?: boolean;
  className?: string;
  hideTokenEnablingStep?: boolean;
}

export const ApproveTokenSteps: React.FC<ApproveTokenStepsProps> = ({
  token,
  approveToken,
  isTokenApproved,
  isWalletSpendingLimitLoading,
  isApproveTokenLoading,
  hideTokenEnablingStep,
  isUsingSwap = false,
  className,
  children,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const showApproveTokenStep =
    !hideTokenEnablingStep && !isWalletSpendingLimitLoading && !isTokenApproved;

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

  return (
    <div className={className}>
      {showApproveTokenStep && (
        <>
          <div css={styles.buttonLabelContainer}>
            <Typography variant="small1" component="label" css={styles.buttonLabel}>
              {t('approveTokenSteps.step1')}
            </Typography>

            {isUsingSwap && (
              <Tooltip
                title={t('approveTokenSteps.approveTokenButton.tooltip')}
                css={styles.approveTokenTooltip}
              >
                <Icon name="info" />
              </Tooltip>
            )}
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
        </>
      )}

      {children}
    </div>
  );
};
