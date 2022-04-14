/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';
import BigNumber from 'bignumber.js';
import Typography from '@mui/material/Typography';
import { AuthContext } from 'context/AuthContext';
import { TokenId } from 'types';
import { formatApy } from 'utilities/common';
import useApproveToken from 'clients/api/mutations/useApproveToken';
import { Icon, IconName } from '../Icon';
import { PrimaryButton } from '../Button';
import useStyles from './styles';

export interface IEnableTokenProps {
  symbol: TokenId;
  isEnabled: boolean;
  title: string;
  tokenInfo: { symbol: TokenId; text: string; apy: BigNumber | number }[];
  approveToken: () => void;
  vtokenAddress: string;
  disabled: boolean;
}

export const EnableTokenUi: React.FC<Omit<IEnableTokenProps, 'vtokenAddress'>> = ({
  symbol,
  title,
  tokenInfo,
  isEnabled,
  children,
  approveToken,
  disabled,
}) => {
  const styles = useStyles();
  if (isEnabled) {
    return <>{children}</>;
  }
  return (
    <div css={styles.container}>
      <Icon name={symbol as IconName} css={styles.mainLogo} />
      <Typography component="h3" variant="h3" css={styles.mainText}>
        {title}
      </Typography>
      <hr />
      {tokenInfo.map(({ symbol: infoSymbol, text, apy }) => (
        <div css={styles.tokenInfo}>
          <div css={styles.tokenInfoText}>
            <Icon name={infoSymbol as IconName} size="20px" />
            <Typography variant="small1" component="span">
              {text}
            </Typography>
          </div>
          <Typography variant="small1" component="span" css={styles.apy}>
            {formatApy(apy)}
          </Typography>
        </div>
      ))}
      <PrimaryButton disabled={disabled} fullWidth css={styles.button} onClick={approveToken}>
        Enable
      </PrimaryButton>
    </div>
  );
};

const EnableToken = ({
  symbol,
  vtokenAddress,
  ...rest
}: Omit<IEnableTokenProps, 'approveToken' | 'account'>) => {
  const { mutate: approveToken } = useApproveToken({ assetId: symbol });
  const { account } = useContext(AuthContext);
  return (
    <EnableTokenUi
      {...rest}
      symbol={symbol}
      approveToken={() => approveToken({ account: account?.address, vtokenAddress })}
      disabled={!account}
    />
  );
};

export default EnableToken;
