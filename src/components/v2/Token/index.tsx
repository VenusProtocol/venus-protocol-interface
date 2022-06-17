/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { TokenId } from 'types';
import { TypographyVariant } from 'theme/MuiThemeProvider/muiTheme';
import { getToken } from 'utilities';
import { Icon } from '../Icon';
import { useStyles } from './styles';

export interface ITokenProps {
  className?: string;
  tokenId: TokenId;
  variant?: TypographyVariant;
}

export const Token: React.FC<ITokenProps> = ({ className, tokenId, variant }) => {
  const styles = useStyles();
  const { id, symbol } = getToken(tokenId);

  return (
    <div className={className} css={styles.container}>
      <Icon name={id} css={styles.icon} />
      <Typography component="span" variant={variant}>
        {symbol}
      </Typography>
    </div>
  );
};
