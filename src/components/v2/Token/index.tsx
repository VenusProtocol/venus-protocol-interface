/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { TokenSymbol } from 'types';
import { Icon, IconName } from '../Icon';
import { useStyles } from './styles';

export interface ITokenProps {
  className?: string;
  symbol: TokenSymbol;
}

export const Token: React.FC<ITokenProps> = ({ className, symbol }) => {
  const styles = useStyles();

  return (
    <div className={className} css={styles.container}>
      <Icon name={symbol as IconName} css={styles.icon} />
      <Typography component="span">{symbol.toUpperCase()}</Typography>
    </div>
  );
};
