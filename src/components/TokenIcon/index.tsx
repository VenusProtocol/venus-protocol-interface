/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { Token } from 'types';

import { TypographyVariant } from 'theme/MuiThemeProvider/muiTheme';

import { useStyles } from './styles';

export interface TokenIconProps {
  token: Token;
  className?: string;
  variant?: TypographyVariant;
  showSymbol?: boolean;
}

export const TokenIcon: React.FC<TokenIconProps> = ({
  className,
  token,
  variant,
  showSymbol = false,
}) => {
  const styles = useStyles();

  return (
    <div className={className} css={styles.container}>
      <img src={token.asset} css={styles.icon} alt={token.symbol} />

      {showSymbol && (
        <Typography component="span" variant={variant}>
          {token.symbol}
        </Typography>
      )}
    </div>
  );
};
