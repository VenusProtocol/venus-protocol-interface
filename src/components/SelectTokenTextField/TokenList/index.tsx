/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { InputHTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';
import { convertWeiToTokens } from 'utilities';

import { TextField } from '../../TextField';
import { Token } from '../../Token';
import { useStyles as useParentStyles } from '../styles';
import { TokenBalance } from '../types';
import { useStyles } from './styles';

export interface TokenListProps {
  tokenBalances: TokenBalance[];
  onTokenClick: (tokenId: TokenId) => void;
}

export const TokenList: React.FC<TokenListProps> = ({ tokenBalances, onTokenClick }) => {
  const { t } = useTranslation();
  const parentStyles = useParentStyles();
  const styles = useStyles();

  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = event =>
    setSearchValue(event.currentTarget.value);

  // Sort token balances alphabetically
  const sortedTokenBalances = useMemo(
    () => [...tokenBalances].sort((a, b) => a.tokenId.localeCompare(b.tokenId)),
    [JSON.stringify(tokenBalances)],
  );

  // Filter token balances based on search
  const filteredTokenBalances = useMemo(() => {
    if (!searchValue) {
      return sortedTokenBalances;
    }

    return sortedTokenBalances.filter(tokenBalance =>
      tokenBalance.tokenId.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [JSON.stringify(sortedTokenBalances), searchValue]);

  return (
    <div css={styles.container}>
      <TextField
        css={styles.searchField}
        isSmall
        value={searchValue}
        onChange={handleSearchInputChange}
        placeholder={t('selectTokenTextField.searchInput.placeholder')}
        leftIconName="magnifier"
      />

      <div css={styles.list}>
        {filteredTokenBalances.map(({ tokenId, balanceWei }) => (
          <div
            css={styles.item}
            onClick={() => onTokenClick(tokenId)}
            key={`select-token-text-field-item-${tokenId}`}
          >
            <Token css={parentStyles.token} tokenId={tokenId} />

            <Typography variant="small2">
              {convertWeiToTokens({
                valueWei: balanceWei,
                tokenId,
                returnInReadableFormat: true,
              })}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
