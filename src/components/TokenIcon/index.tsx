/** @jsxImportSource @emotion/react */
import React from 'react';
import { Token } from 'types';

import { useStyles } from './styles';

export interface TokenIconProps {
  token: Token;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ className, token }) => {
  const styles = useStyles();

  return <img src={token.asset} css={styles.icon} alt={token.symbol} className={className} />;
};
