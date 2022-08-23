/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import { TypographyVariant } from 'theme/MuiThemeProvider/muiTheme';

import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface TokenProps {
  className?: string;
  tokenId: TokenId;
  displaySymbol?: boolean;
  variant?: TypographyVariant;
}

export const Token: React.FC<TokenProps> = ({
  className,
  tokenId,
  displaySymbol = true,
  variant,
}) => {
  const styles = useStyles();
  const { id, symbol } = getToken(tokenId);

  return (
    <div className={className} css={styles.container}>
      <Icon name={id} css={styles.icon} />

      {displaySymbol && (
        <Typography component="span" variant={variant}>
          {symbol}
        </Typography>
      )}
    </div>
  );
};
