/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import { VError, formatVErrorToReadableString } from 'errors';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { AuthContext } from 'context/AuthContext';
import useTokenApproval from 'hooks/useTokenApproval';

import { SecondaryButton } from '../Button';
import { Delimiter } from '../Delimiter';
import { LabeledInlineContent, LabeledInlineContentProps } from '../LabeledInlineContent';
import { Spinner } from '../Spinner';
import { TokenIcon } from '../TokenIcon';
import useStyles from './styles';

export interface EnableTokenUiProps {
  token: Token;
  title: string | React.ReactElement;
  isTokenEnabled: boolean;
  enableToken: () => Promise<TransactionReceipt | undefined>;
  isInitialLoading?: boolean;
  isEnableTokenLoading?: boolean;
  tokenInfo?: LabeledInlineContentProps[];
  disabled?: boolean;
}

export const EnableTokenUi: React.FC<EnableTokenUiProps> = ({
  token,
  title,
  tokenInfo = [],
  children,
  enableToken,
  isTokenEnabled,
  isInitialLoading = false,
  isEnableTokenLoading = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (isTokenEnabled) {
    return <>{children}</>;
  }

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

          {tokenInfo.length > 0 && (
            <div css={styles.tokenInfoContainer}>
              <Delimiter css={styles.delimiter} />

              {tokenInfo.map(info => (
                <LabeledInlineContent
                  {...info}
                  key={info.label}
                  css={styles.labeledInlineContent}
                />
              ))}
            </div>
          )}

          <SecondaryButton
            disabled={disabled || isEnableTokenLoading}
            loading={isEnableTokenLoading}
            fullWidth
            onClick={handleEnableToken}
          >
            {t('enableToken.enableButtonLabel')}
          </SecondaryButton>
        </>
      )}
    </div>
  );
};

export interface EnableTokenProps
  extends Pick<EnableTokenUiProps, 'tokenInfo' | 'disabled' | 'title' | 'token'> {
  spenderAddress: string;
}

export const EnableToken: React.FC<EnableTokenProps> = ({ token, spenderAddress, ...rest }) => {
  const { account } = useContext(AuthContext);

  const { isTokenApprovalStatusLoading, isTokenApproved, approveToken, isApproveTokenLoading } =
    useTokenApproval({
      token,
      spenderAddress,
      token,
    },
    {
      enabled: !!account?.address,
    },
  );

  const isTokenApproved =
    token.isNative ||
    (!!getTokenAllowanceData && getTokenAllowanceData.allowanceWei.isGreaterThan(0));

  const { mutate: contractApproveToken, isLoading: isApproveTokenLoading } = useApproveToken({
    token,
  });

  const approveToken = () => {
    if (account?.address) {
      contractApproveToken({
        accountAddress: account.address,
        spenderAddress,
      });
    }
  };

  return (
    <EnableTokenUi
      {...rest}
      token={token}
      enableToken={approveToken}
      isTokenEnabled={isTokenApproved ?? false}
      isEnableTokenLoading={isApproveTokenLoading}
      isInitialLoading={isTokenApprovalStatusLoading}
      disabled={!account}
    />
  );
};

export default EnableToken;
