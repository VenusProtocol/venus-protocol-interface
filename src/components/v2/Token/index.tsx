/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { TokenId } from 'types';
import { TypographyVariant } from 'theme/MuiThemeProvider/muiTheme';
import { Icon, IconName } from '../Icon';
import { useStyles } from './styles';

export interface ITokenProps {
  className?: string;
  symbol: TokenId;
  variant?: TypographyVariant;
}

export const Token: React.FC<ITokenProps> = ({ className, symbol, variant }) => {
  const styles = useStyles();

  return (
    <div className={className} css={styles.container}>
      <Icon name={symbol.toLowerCase() as IconName} css={styles.icon} />
      <Typography component="span" variant={variant}>
        {symbol.toUpperCase()}
      </Typography>
    </div>
  );
};
