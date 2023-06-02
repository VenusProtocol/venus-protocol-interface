/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { VError, formatVErrorToReadableString } from 'errors';
import { ContractReceipt } from 'ethers';
import React from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { useAuth } from 'context/AuthContext';
import useTokenApproval from 'hooks/useTokenApproval';

import { SecondaryButton } from '../Button';
import { LabeledInlineContent, LabeledInlineContentProps } from '../LabeledInlineContent';
import { Spinner } from '../Spinner';
import { toast } from '../Toast';
import { TokenIcon } from '../TokenIcon';
import useStyles from './styles';

export interface ApproveTokenUiProps {
  token: Token;
  title: string | React.ReactElement;
  isTokenApproved: boolean;
  approvedToken: () => Promise<ContractReceipt | undefined>;
  isInitialLoading?: boolean;
  isApproveTokenLoading?: boolean;
  assetInfo?: LabeledInlineContentProps[];
  disabled?: boolean;
}

export const ApproveTokenUi: React.FC<ApproveTokenUiProps> = ({
  token,
  title,
  assetInfo = [],
  children,
  approvedToken,
  isTokenApproved,
  isInitialLoading = false,
  isApproveTokenLoading = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (isTokenApproved) {
    return <>{children}</>;
  }

  const handleApproveToken = async () => {
    try {
      await approvedToken();
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
    <div css={styles.container}>
      {isInitialLoading ? (
        <Spinner />
      ) : (
        <>
          <TokenIcon token={token} css={styles.mainLogo} />

          <Typography component="h3" variant="h3" css={styles.mainText}>
            {title}
          </Typography>

          {assetInfo.length > 0 && (
            <div css={styles.assetInfoContainer}>
              {assetInfo.map(info => (
                <LabeledInlineContent
                  {...info}
                  key={info.label}
                  css={styles.labeledInlineContent}
                />
              ))}
            </div>
          )}

          <SecondaryButton
            disabled={disabled || isApproveTokenLoading}
            loading={isApproveTokenLoading}
            fullWidth
            onClick={handleApproveToken}
          >
            {t('approvedToken.approveButtonLabel')}
          </SecondaryButton>
        </>
      )}
    </div>
  );
};

export interface ApproveTokenProps
  extends Pick<ApproveTokenUiProps, 'assetInfo' | 'disabled' | 'title' | 'token'> {
  spenderAddress: string;
}

export const ApproveToken: React.FC<ApproveTokenProps> = ({ token, spenderAddress, ...rest }) => {
  const { accountAddress } = useAuth();

  const { isTokenApprovalStatusLoading, isTokenApproved, approveToken, isApproveTokenLoading } =
    useTokenApproval({
      token,
      spenderAddress,
      accountAddress,
    });

  return (
    <ApproveTokenUi
      {...rest}
      token={token}
      approvedToken={approveToken}
      isTokenApproved={isTokenApproved ?? false}
      isApproveTokenLoading={isApproveTokenLoading}
      isInitialLoading={isTokenApprovalStatusLoading}
      disabled={!accountAddress}
    />
  );
};

export default ApproveToken;
