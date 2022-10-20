/** @jsxImportSource @emotion/react */
import React, { InputHTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';

import { TextField } from '../../TextField';
import { Token } from '../../Token';
import { useStyles as useParentStyles } from '../styles';
import { useStyles } from './styles';

export interface TokenListProps {
  tokenIds: TokenId[];
  onTokenClick: (tokenId: TokenId) => void;
}

export const TokenList: React.FC<TokenListProps> = ({ tokenIds, onTokenClick }) => {
  const { t } = useTranslation();
  const parentStyles = useParentStyles();
  const styles = useStyles();

  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = event =>
    setSearchValue(event.currentTarget.value);

  // Sort token balances alphabetically
  const sortedTokenIds = useMemo(
    () => [...tokenIds].sort((a, b) => a.localeCompare(b)) as TokenId[],
    [JSON.stringify(tokenIds)],
  );

  // Filter token balances based on search
  const filteredTokenIds = useMemo(() => {
    if (!searchValue) {
      return sortedTokenIds;
    }

    return sortedTokenIds.filter(tokenId =>
      tokenId.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [JSON.stringify(sortedTokenIds), searchValue]);

  return (
    <div css={styles.container}>
      <TextField
        css={styles.searchField}
        isSmall
        autoFocus
        value={searchValue}
        onChange={handleSearchInputChange}
        placeholder={t('selectTokenTextField.searchInput.placeholder')}
        leftIconName="magnifier"
      />

      <div css={styles.list}>
        {filteredTokenIds.map(tokenId => (
          <div
            css={styles.item}
            onClick={() => onTokenClick(tokenId)}
            key={`select-token-text-field-item-${tokenId}`}
          >
            <Token css={parentStyles.token} tokenId={tokenId} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
