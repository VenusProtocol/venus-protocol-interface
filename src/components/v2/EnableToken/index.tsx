/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import Typography from '@mui/material/Typography';
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
  tokenInfo: ILabeledInlineContentProps[];
  approveToken: () => void;
  vtokenAddress: string;
  disabled?: boolean;
}

export const EnableTokenUi: React.FC<Omit<IEnableTokenProps, 'vtokenAddress'>> = ({
  assetId,
  title,
  tokenInfo,
  isEnabled,
  children,
  approveToken,
  disabled = false,
}) => {
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
      <Delimiter />
      {tokenInfo.map(info => (
        <LabeledInlineContent {...info} key={info.label} css={styles.labeledInlineContent} />
      ))}
      <SecondaryButton disabled={disabled} fullWidth css={styles.button} onClick={approveToken}>
        Enable
      </SecondaryButton>
    </div>
  );
};

export const EnableToken: React.FC<
  Omit<IEnableTokenProps, 'approveToken' | 'account' | 'disabled'>
> = ({ vtokenAddress, assetId, ...rest }) => {
  const { mutate: approveToken } = useApproveToken({ assetId });
  const { account } = useContext(AuthContext);
  return (
    <EnableTokenUi
      {...rest}
      assetId={assetId}
      approveToken={() => approveToken({ accountAddress: account?.address, vtokenAddress })}
      disabled={!account}
    />
  );
};

export default EnableToken;
