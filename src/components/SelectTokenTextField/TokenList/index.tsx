/** @jsxImportSource @emotion/react */
import React, { InputHTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import { TextField } from '../../TextField';
import { TokenIconWithSymbol } from '../../TokenIconWithSymbol';
import { useStyles as useParentStyles } from '../styles';
import { getTokenListItemTestId } from '../testIdGetters';
import { useStyles } from './styles';

export interface TokenListProps {
  tokens: Token[];
  onTokenClick: (token: Token) => void;
  'data-testid'?: string;
}

export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  onTokenClick,
  'data-testid': testId,
}) => {
  const { t } = useTranslation();
  const parentStyles = useParentStyles();
  const styles = useStyles();

  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = event =>
    setSearchValue(event.currentTarget.value);

  // Sort tokens alphabetically by their symbols
  const sortedTokens = useMemo(
    () => [...tokens].sort((a, b) => a.symbol.localeCompare(b.symbol)) as Token[],
    [tokens],
  );

  // Filter tokens based on search
  const filteredTokens = useMemo(() => {
    if (!searchValue) {
      return sortedTokens;
    }

    return sortedTokens.filter(token =>
      token.symbol.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [sortedTokens, searchValue]);

  return (
    <div css={styles.container}>
      <TextField
        css={styles.searchField}
        isSmall
        autoFocus
        value={searchValue}
        onChange={handleSearchInputChange}
        placeholder={t('selectTokenTextField.searchInput.placeholder')}
        leftIconSrc="magnifier"
      />

      <div css={styles.list}>
        {filteredTokens.map(token => (
          <div
            css={styles.item}
            onClick={() => onTokenClick(token)}
            key={`select-token-text-field-item-${token.symbol}`}
            data-testid={
              !!testId &&
              getTokenListItemTestId({
                parentTestId: testId,
                tokenAddress: token.address,
              })
            }
          >
            <TokenIconWithSymbol css={parentStyles.token} token={token} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
