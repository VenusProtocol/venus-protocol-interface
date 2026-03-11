import { cn } from '@venusprotocol/ui';
import { Icon, TokenIcon, TokenListWrapper } from 'components';
import type { OptionalTokenBalance } from 'components/TokenListWrapper';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';

export interface TokenPairSelectorProps {
  side: 'long' | 'short';
  onSideChange: (side: 'long' | 'short') => void;
  longToken: Token;
  shortToken: Token;
  longTokenOptions: Token[];
  shortTokenOptions: Token[];
  onLongTokenChange: (token: Token) => void;
  onShortTokenChange: (token: Token) => void;
  className?: string;
}

const tokensToBalances = (tokens: Token[]): OptionalTokenBalance[] =>
  tokens.map(token => ({ token }));

export const TokenPairSelector: React.FC<TokenPairSelectorProps> = ({
  onSideChange,
  longToken,
  shortToken,
  longTokenOptions,
  shortTokenOptions,
  onLongTokenChange,
  onShortTokenChange,
  className,
}) => {
  const { t } = useTranslation();
  const [isLongListOpen, setIsLongListOpen] = useState(false);
  const [isShortListOpen, setIsShortListOpen] = useState(false);

  const longTokenBalances = tokensToBalances(longTokenOptions);
  const shortTokenBalances = tokensToBalances(shortTokenOptions);

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Long selector */}
      <div className="flex-1 min-w-0">
        <TokenListWrapper
          tokenBalances={longTokenBalances}
          onTokenClick={token => {
            onLongTokenChange(token);
            setIsLongListOpen(false);
          }}
          onClose={() => setIsLongListOpen(false)}
          isListShown={isLongListOpen}
          selectedToken={longToken}
          displayCommonTokenButtons
        >
          <button
            type="button"
            onClick={() => {
              setIsLongListOpen(prev => !prev);
              setIsShortListOpen(false);
            }}
            className="flex items-center w-full border border-green rounded-lg cursor-pointer transition-colors hover:border-green-hover"
          >
            {/* Long pill */}
            <div
              className="shrink-0 bg-green rounded-lg px-2 py-3 text-b1s text-white cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                onSideChange('long');
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  onSideChange('long');
                }
              }}
            >
              {t('yieldPlus.long')}
            </div>

            {/* Token display */}
            <div className="flex-1 flex items-center justify-between p-3 min-w-0">
              <span className="flex items-center gap-x-2 min-w-0">
                <TokenIcon token={longToken} size="md" className="shrink-0" />
                <span className="text-b1s text-white truncate">{longToken.symbol}</span>
              </span>
              <Icon
                name="chevronDown"
                className={cn('text-grey size-3 shrink-0', isLongListOpen && 'rotate-180')}
              />
            </div>
          </button>
        </TokenListWrapper>
      </div>

      {/* Short selector */}
      <div className="flex-1 min-w-0">
        <TokenListWrapper
          tokenBalances={shortTokenBalances}
          onTokenClick={token => {
            onShortTokenChange(token);
            setIsShortListOpen(false);
          }}
          onClose={() => setIsShortListOpen(false)}
          isListShown={isShortListOpen}
          selectedToken={shortToken}
          displayCommonTokenButtons
        >
          <button
            type="button"
            onClick={() => {
              setIsShortListOpen(prev => !prev);
              setIsLongListOpen(false);
            }}
            className="flex items-center w-full border border-red rounded-lg cursor-pointer transition-colors hover:border-red-hover"
          >
            {/* Short pill */}
            <div
              className="shrink-0 bg-red rounded-lg px-2 py-3 text-b1s text-white cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                onSideChange('short');
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.stopPropagation();
                  onSideChange('short');
                }
              }}
            >
              {t('yieldPlus.short')}
            </div>

            {/* Token display */}
            <div className="flex-1 flex items-center justify-between p-3 min-w-0">
              <span className="flex items-center gap-x-2 min-w-0">
                <TokenIcon token={shortToken} size="md" className="shrink-0" />
                <span className="text-b1s text-white truncate">{shortToken.symbol}</span>
              </span>
              <Icon
                name="chevronDown"
                className={cn('text-grey size-3 shrink-0', isShortListOpen && 'rotate-180')}
              />
            </div>
          </button>
        </TokenListWrapper>
      </div>
    </div>
  );
};
