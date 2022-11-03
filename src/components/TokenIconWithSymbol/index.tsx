/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { Token } from 'types';

import { TypographyVariant } from 'theme/MuiThemeProvider/muiTheme';

import { TokenIcon } from '../TokenIcon';
import { useStyles } from './styles';

export interface TokenIconWithSymbolProps {
  token: Token;
  className?: string;
  variant?: TypographyVariant;
}

export const TokenIconWithSymbol: React.FC<TokenIconWithSymbolProps> = ({
  className,
  token,
  variant,
}) => {
  const styles = useStyles();

  return (
    <div className={className} css={styles.container}>
      <TokenIcon token={token} css={styles.icon} />

      <Typography component="span" variant={variant}>
        {token.symbol}
      </Typography>
    </div>
  );
};
