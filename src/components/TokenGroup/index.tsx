/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { Token } from 'types';

import { TokenIcon } from '../TokenIcon';
import { useStyles } from './styles';

export interface TokenGroupProps {
  className?: string;
  tokens: Token[];
  limit?: number;
}

export const TokenGroup: React.FC<TokenGroupProps> = ({ className, tokens, limit = 0 }) => {
  const styles = useStyles();

  const filteredTokens = limit > 0 ? tokens.slice(0, limit) : tokens;

  return (
    <div css={styles.container} className={className}>
      {filteredTokens.map(token => (
        <TokenIcon css={styles.token} token={token} key={`token-group-item-${token.address}`} />
      ))}

      {limit > 0 && tokens.length > limit && (
        <Typography variant="small2" css={styles.leftoverCount}>
          +{tokens.length - limit}
        </Typography>
      )}
    </div>
  );
};
