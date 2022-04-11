/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import Typography from '@mui/material/Typography';
import { TokenSymbol } from 'types';
import { formatApy } from 'utilities/common';
import { Icon, IconName } from '../Icon';
import { PrimaryButton } from '../Button';
import useStyles from './styles';

export interface IEnableTokenProps {
  symbol: TokenSymbol;
  isEnabled: boolean;
  title: string;
  tokenInfo: { symbol: TokenSymbol; text: string; apy: BigNumber | number }[];
  children: React.ReactElement;
}

export const EnableToken: React.FC<IEnableTokenProps> = ({
  symbol,
  title,
  tokenInfo,
  isEnabled,
  children,
}: IEnableTokenProps) => {
  const styles = useStyles();
  if (isEnabled) {
    return children;
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
      <PrimaryButton fullWidth css={styles.button}>
        Enable
      </PrimaryButton>
    </div>
  );
};
