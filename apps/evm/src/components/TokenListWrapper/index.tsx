import { Typography } from '@mui/material';
import { type InputHTMLAttributes, useMemo, useState } from 'react';

import { SenaryButton, cn } from '@venusprotocol/ui';
import { Icon } from 'components';
import { TokenIconWithSymbol } from 'components/TokenIconWithSymbol';
import { useTranslation } from 'libs/translations';
import type { Token, TokenBalance } from 'types';
import { areTokensEqual, convertMantissaToTokens } from 'utilities';
import { TextField } from '../TextField';
import { getTokenListItemTestId } from './testIdGetters';

export interface OptionalTokenBalance extends Omit<TokenBalance, 'balanceMantissa'> {
  balanceMantissa?: BigNumber;
}

export interface TokenListWrapperProps {
  children: React.ReactNode;
  tokenBalances: OptionalTokenBalance[];
  onTokenClick: (token: Token) => void;
  onClose: () => void;
  isListShown: boolean;
  selectedToken: Token;
  displayCommonTokenButtons?: boolean;
  'data-testid'?: string;
}

const commonTokenSymbols = ['XVS', 'BNB', 'USDT', 'BTCB'];

export const TokenListWrapper: React.FC<TokenListWrapperProps> = ({
  children,
  tokenBalances,
  onTokenClick,
  onClose,
  isListShown,
  selectedToken,
  displayCommonTokenButtons = true,
  'data-testid': testId,
}) => {
  const { t } = useTranslation();

  const commonTokenBalances = displayCommonTokenButtons
    ? tokenBalances.filter(tokenBalance => commonTokenSymbols.includes(tokenBalance.token.symbol))
    : [];

  const [searchValue, onSearchValueChange] = useState('');

  const handleSearchInputChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = event =>
    onSearchValueChange(event.currentTarget.value);

  // Sort tokens by balance (if it exists)
  const sortedTokenBalances = useMemo(
    () =>
      [...tokenBalances].sort((a, b) => {
        const aIsNonNegative = !!a.balanceMantissa?.isGreaterThan(0);
        const bIsNonNegative = !!b.balanceMantissa?.isGreaterThan(0);

        // Both are non-negative
        if (aIsNonNegative === bIsNonNegative) {
          return 0;
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
    <div>
      {children}

      {isListShown && (
        <div className="relative">
          <div className="bg-cards border border-lightGrey absolute z-[2] left-0 right-0 top-2 rounded-xl overflow-hidden shadow-[0_4px_15px_0_#0d1017]">
            {tokenBalances.length > 5 && (
              <div className="mb-3 pl-3 pr-3 pt-3 space-y-3">
                <TextField
                  size="xs"
                  variant="secondary"
                  autoFocus
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  placeholder={t('selectTokenTextField.searchInput.placeholder')}
                  leftIconSrc="magnifier"
                />

                {commonTokenBalances.length > 2 && (
                  <div className="flex overflow-y-auto gap-x-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {commonTokenBalances.map(commonTokenBalance => (
                      <SenaryButton
                        onClick={() => onTokenClick(commonTokenBalance.token)}
                        className="shrink-0"
                        key={`select-token-text-field-common-token-${commonTokenBalance.token.symbol}`}
                      >
                        <TokenIconWithSymbol
                          className="font-semibold text-sm"
                          tokenIconClassName="size-5"
                          token={commonTokenBalance.token}
                        />
                      </SenaryButton>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="max-h-50 overflow-y-auto">
              {filteredTokenBalances.map(tokenBalance => (
                <div
                  className="cursor-pointer flex items-center justify-between h-12 px-3 hover:bg-lightGrey"
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
                  <TokenIconWithSymbol
                    className="font-semibold text-sm"
                    tokenIconClassName="size-5"
                    token={tokenBalance.token}
                  />

                  {tokenBalance.balanceMantissa && (
                    <Typography variant="small2" className="text-white">
                      {convertMantissaToTokens({
                        value: tokenBalance.balanceMantissa,
                        token: tokenBalance.token,
                        returnInReadableFormat: true,
                        addSymbol: false,
                      })}
                    </Typography>
                  )}

                  {!tokenBalance.balanceMantissa &&
                    areTokensEqual(tokenBalance.token, selectedToken) && (
                      <Icon name="mark" className="text-green size-5" />
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={cn('fixed inset-0 z-1', !isListShown && 'hidden')} onClick={onClose} />
    </div>
  );
};
