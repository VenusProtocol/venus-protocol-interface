/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';

import { useTranslation } from 'translation';
import { AuthContext } from 'context/AuthContext';
import { TokenId } from 'types';
import useApproveToken from 'clients/api/mutations/useApproveToken';
import { Icon, IconName } from '../Icon';
import { SecondaryButton } from '../Button';
import useStyles from './styles';
import { Delimiter } from '../Delimiter';
import { LabeledInlineContent, ILabeledInlineContentProps } from '../LabeledInlineContent';

export interface IEnableTokenProps {
  assetId: TokenId;
  isEnabled: boolean;
  title: string | React.ReactElement;
  approveToken: () => void;
  vtokenAddress: string;
  tokenInfo?: ILabeledInlineContentProps[];
  disabled?: boolean;
  isApproveTokenLoading?: boolean;
}

export const EnableTokenUi: React.FC<Omit<IEnableTokenProps, 'vtokenAddress'>> = ({
  assetId,
  title,
  tokenInfo = [],
  isEnabled,
  children,
  approveToken,
  isApproveTokenLoading = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  if (isEnabled) {
    return <>{children}</>;
  }

  return (
    <div css={styles.container}>
      <Icon name={assetId as IconName} css={styles.mainLogo} />

      <Typography component="h3" variant="h3" css={styles.mainText}>
        {title}
      </Typography>

      {tokenInfo.length > 0 && (
        <div css={styles.tokenInfoContainer}>
          <Delimiter css={styles.delimiter} />

          {tokenInfo.map(info => (
            <LabeledInlineContent {...info} key={info.label} css={styles.labeledInlineContent} />
          ))}
        </div>
      )}

      <SecondaryButton
        disabled={disabled || isApproveTokenLoading}
        loading={isApproveTokenLoading}
        fullWidth
        onClick={approveToken}
      >
        {t('enableToken.enableButtonLabel')}
      </SecondaryButton>
    </div>
  );
};

export const EnableToken: React.FC<
  Omit<IEnableTokenProps, 'approveToken' | 'account' | 'disabled'>
> = ({ vtokenAddress, assetId, ...rest }) => {
  const { mutate: approveToken, isLoading: isApproveTokenLoading } = useApproveToken({ assetId });
  const { account } = useContext(AuthContext);

  return (
    <EnableTokenUi
      {...rest}
      assetId={assetId}
      approveToken={() => approveToken({ accountAddress: account?.address, vtokenAddress })}
      isApproveTokenLoading={isApproveTokenLoading}
      disabled={!account}
    />
  );
};

export default EnableToken;
