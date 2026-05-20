import { SelectButton, cn } from '@venusprotocol/ui';

import { Icon, type OptionalTokenBalance, TokenIconWithSymbol, TokenListWrapper } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';
import { compareBooleans } from 'utilities';

export interface TokenSelectProps {
  selectedToken: Token;
  tokenBalances: OptionalTokenBalance[];
  onChangeSelectedToken: (token: Token) => void;
  type: 'long' | 'short';
  displayCommonTokenButtons?: boolean;
  className?: string;
  'data-testid'?: string;
  disabled?: boolean;
}

export const TokenSelect: React.FC<TokenSelectProps> = ({
  className,
  selectedToken,
  tokenBalances,
  onChangeSelectedToken,
  'data-testid': testId,
  type,
  disabled,
}) => {
  const { t } = useTranslation();

  const [isTokenListShown, setIsTokenListShown] = useState(false);
  const showTokenList = () => setIsTokenListShown(true);
  const hideTokenList = () => setIsTokenListShown(false);

  const sortedTokenBalances = [...tokenBalances].sort((a, b) =>
    compareBooleans(a.isDeemed ?? false, b.isDeemed ?? false, 'asc'),
  );

  return (
    <TokenListWrapper
      className={cn('w-full', className)}
      onTokenClick={onChangeSelectedToken}
      tokenBalances={sortedTokenBalances}
      onClose={hideTokenList}
      isListShown={isTokenListShown}
      selectedToken={selectedToken}
      data-testid={testId}
    >
      <SelectButton
        className={cn(
          'w-full p-0 overflow-hidden',
          type === 'long' ? 'border-green' : 'border-red',
        )}
        contentClassName="w-full"
        onClick={showTokenList}
        disabled={disabled}
        type="button"
      >
        <div
          className={cn(
            'h-full flex w-12 shrink-0 items-center justify-center py-3 rounded-r-lg',
            type === 'long' ? 'bg-green' : 'bg-red',
          )}
        >
          {type === 'long' ? t('trade.longTokenSelect.label') : t('trade.shortTokenSelect.label')}
        </div>

        <div className="w-full flex items-center justify-between px-3">
          <div className="flex items-center gap-x-2">
            <TokenIconWithSymbol token={selectedToken} />
          </div>

          <Icon
            name="arrowUp"
            className={cn(
              'w-5 h-5',
              !isTokenListShown && 'rotate-180',
              disabled ? 'text-grey' : 'text-white',
            )}
          />
        </div>
      </SelectButton>
    </TokenListWrapper>
  );
};
