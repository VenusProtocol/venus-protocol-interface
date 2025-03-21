/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { type InputHTMLAttributes, useMemo, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import { TokenIconWithSymbol } from 'components/TokenIconWithSymbol';
import { useTranslation } from 'libs/translations';
import type { Token, TokenBalance } from 'types';
import { convertMantissaToTokens } from 'utilities';

import { SenaryButton } from '@venusprotocol/ui';
import { TextField } from '../../TextField';
import { useStyles as useParentStyles } from '../styles';
import { getTokenListItemTestId } from '../testIdGetters';
import { useStyles } from './styles';

export interface TokenListProps {
  tokenBalances: TokenBalance[];
  onTokenClick: (token: Token) => void;
  'data-testid'?: string;
}

const commonTokenSymbols = ['XVS', 'BNB', 'USDT', 'BTCB'];

export const TokenList: React.FC<TokenListProps> = ({
  tokenBalances,
  onTokenClick,
  'data-testid': testId,
}) => {
  const { t } = useTranslation();
  const parentStyles = useParentStyles();
  const styles = useStyles();

  const commonTokenBalances = useMemo(
    () =>
      tokenBalances.filter(tokenBalance => commonTokenSymbols.includes(tokenBalance.token.symbol)),
    [tokenBalances],
  );

  const [searchValue, setSearchValue] = useState('');

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = event =>
    setSearchValue(event.currentTarget.value);

  // Sort tokens alphabetically, placing tokens with a non-zero balance at the
  // top of the list
  const sortedTokenBalances = useMemo(
    () =>
      [...tokenBalances].sort((a, b) => {
        const aIsNonNegative = a.balanceMantissa.isGreaterThan(0);
        const bIsNonNegative = b.balanceMantissa.isGreaterThan(0);

        // Both are non-negative or both are negative
        if (aIsNonNegative === bIsNonNegative) {
          return a.token.symbol.localeCompare(b.token.symbol);
        }

        // If a is non-negative and b is negative, a comes first
        if (aIsNonNegative) {
          return -1;
        }

        // If b is non-negative and a is negative, b comes first
        return 1;
      }) as TokenBalance[],
    [tokenBalances],
  );

  // Filter tokens based on search
  const filteredTokenBalances = useMemo(() => {
    if (!searchValue) {
      return sortedTokenBalances;
    }

    const formattedSearchValue = searchValue.toLowerCase();

    // Enable user to search by symbol or address
    return sortedTokenBalances.filter(
      tokenBalance =>
        tokenBalance.token.symbol.toLowerCase().includes(formattedSearchValue) ||
        tokenBalance.token.address.toLowerCase().includes(formattedSearchValue),
    );
  }, [sortedTokenBalances, searchValue]);

  return (
    <div css={styles.container}>
      <div className={cn(commonTokenBalances.length > 2 && 'mb-5 pl-3 pr-3 pt-3')}>
        {commonTokenBalances.length > 2 && (
          <>
            <TextField
              css={styles.searchField}
              isSmall
              autoFocus
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder={t('selectTokenTextField.searchInput.placeholder')}
              leftIconSrc="magnifier"
            />
            <div css={styles.commonTokenList}>
              {commonTokenBalances.map(commonTokenBalance => (
                <SenaryButton
                  onClick={() => onTokenClick(commonTokenBalance.token)}
                  css={styles.commonTokenButton}
                  key={`select-token-text-field-common-token-${commonTokenBalance.token.symbol}`}
                >
                  <TokenIconWithSymbol css={parentStyles.token} token={commonTokenBalance.token} />
                </SenaryButton>
              ))}
            </div>
          </>
        )}
      </div>

      <div css={styles.list}>
        {filteredTokenBalances.map(tokenBalance => (
          <div
            css={styles.item}
            onClick={() => onTokenClick(tokenBalance.token)}
            key={`select-token-text-field-item-${tokenBalance.token.address}`}
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
              {convertMantissaToTokens({
                value: tokenBalance.balanceMantissa,
                token: tokenBalance.token,
                returnInReadableFormat: true,

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
