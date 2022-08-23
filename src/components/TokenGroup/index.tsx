/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React from 'react';
import { TokenId } from 'types';

import { Token } from '../Token';
import { useStyles } from './styles';

export interface TokenGroupProps {
  className?: string;
  tokenIds: TokenId[];
  limit?: number;
}

export const TokenGroup: React.FC<TokenGroupProps> = ({ className, tokenIds, limit = 0 }) => {
  const styles = useStyles();

  const filteredTokenIds = limit > 0 ? tokenIds.slice(0, limit) : tokenIds;

  return (
    <div css={styles.container} className={className}>
      {filteredTokenIds.map(tokenId => (
        <Token css={styles.token} tokenId={tokenId} displaySymbol={false} />
      ))}

      {limit > 0 && tokenIds.length > limit && (
        <Typography variant="small2" css={styles.leftoverCount}>
          +{tokenIds.length - limit}
        </Typography>
      )}
    </div>
  );
};
