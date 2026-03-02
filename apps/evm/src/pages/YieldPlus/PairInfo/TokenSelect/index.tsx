import { SelectButton, cn } from '@venusprotocol/ui';

import { Icon, TokenIconWithSymbol, TokenListWrapper } from 'components';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Token } from 'types';

export interface TokenSelectProps {
  selectedToken: Token;
  tokens: Token[];
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
  tokens,
  onChangeSelectedToken,
  'data-testid': testId,
  type,
  disabled,
}) => {
  const { t } = useTranslation();

  const [isTokenListShown, setIsTokenListShown] = useState(false);
  const showTokenList = () => setIsTokenListShown(true);
  const hideTokenList = () => setIsTokenListShown(false);

  const handleChangeSelectedToken = (newSelectedToken: Token) => {
    hideTokenList();
    onChangeSelectedToken(newSelectedToken);
  };

  return (
    <TokenListWrapper
      className={cn('w-full', className)}
      onTokenClick={handleChangeSelectedToken}
      tokenBalances={tokens.map(token => ({ token }))}
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
            'h-full flex w-12 shrink-0 items-center justify-center py-3',
            type === 'long' ? 'bg-green' : 'bg-red',
          )}
        >
          {type === 'long'
            ? t('yieldPlus.longTokenSelect.label')
            : t('yieldPlus.shortTokenSelect.label')}
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
