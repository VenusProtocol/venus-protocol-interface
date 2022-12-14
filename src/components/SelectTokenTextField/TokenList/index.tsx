/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { InputHTMLAttributes, useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Token, TokenBalance } from 'types';
import { convertWeiToTokens } from 'utilities';

import { TextField } from '../../TextField';
import { TokenIconWithSymbol } from '../../TokenIconWithSymbol';
import { useStyles as useParentStyles } from '../styles';
import { getTokenListItemTestId } from '../testIdGetters';
import { useStyles } from './styles';

export interface TokenListProps {
  tokenBalances: TokenBalance[];
  onTokenClick: (token: Token) => void;
  'data-testid'?: string;
}

export const TokenList: React.FC<TokenListProps> = ({
  tokenBalances,
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
  const sortedTokenBalances = useMemo(
    () =>
      [...tokenBalances].sort((a, b) =>
        a.token.symbol.localeCompare(b.token.symbol),
      ) as TokenBalance[],
    [tokenBalances],
  );

  // Filter tokens based on search
  const filteredTokenBalances = useMemo(() => {
    if (!searchValue) {
      return sortedTokenBalances;
    }

    return sortedTokenBalances.filter(tokenBalance =>
      tokenBalance.token.symbol.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [sortedTokenBalances, searchValue]);

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
        {filteredTokenBalances.map(tokenBalance => (
          <div
            css={styles.item}
            onClick={() => onTokenClick(tokenBalance.token)}
            key={`select-token-text-field-item-${tokenBalance.token.symbol}`}
            data-testid={
              !!testId &&
              getTokenListItemTestId({
                parentTestId: testId,
                tokenAddress: tokenBalance.token.address,
              })
            }
          >
            <TokenIconWithSymbol css={parentStyles.token} token={tokenBalance.token} />

            <Typography variant="small2">
              {convertWeiToTokens({
                valueWei: tokenBalance.balanceWei,
                token: tokenBalance.token,
                returnInReadableFormat: true,
                minimizeDecimals: true,
                addSymbol: false,
              })}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
