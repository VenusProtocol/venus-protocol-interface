import { SelectButton, cn } from '@venusprotocol/ui';

import { Icon, TokenIconWithSymbol, TokenListWrapper } from 'components';
import { useState } from 'react';
import type { Token } from 'types';
import { getTokenSelectButtonTestId } from './__testUtils__/getTokenSelectButtonTestId';

export interface SelectTokenFieldProps {
  selectedToken: Token;
  tokens: Token[];
  onChangeSelectedToken: (token: Token) => void;
  label?: string;
  displayCommonTokenButtons?: boolean;
  className?: string;
  'data-testid'?: string;
  disabled?: boolean;
}

export const SelectTokenField: React.FC<SelectTokenFieldProps> = ({
  className,
  selectedToken,
  tokens,
  onChangeSelectedToken,
  'data-testid': testId,
  label,
  disabled,
}) => {
  const [isTokenListShown, setIsTokenListShown] = useState(false);
  const showTokenList = () => setIsTokenListShown(true);
  const hideTokenList = () => setIsTokenListShown(false);

  const handleChangeSelectedToken = (newSelectedToken: Token) => {
    hideTokenList();
    onChangeSelectedToken(newSelectedToken);
  };

  return (
    <div className={cn(className, 'flex flex-col gap-y-1')} data-testid={testId}>
      {!!label && <p className="text-b1r text-light-grey">{label}</p>}

      <TokenListWrapper
        className="w-full"
        onTokenClick={handleChangeSelectedToken}
        tokenBalances={tokens.map(token => ({ token }))}
        onClose={hideTokenList}
        isListShown={isTokenListShown}
        selectedToken={selectedToken}
      >
        <SelectButton
          className={cn(isTokenListShown && 'border-blue', 'w-full')}
          contentClassName="w-full justify-between disabled:bg-transparent"
          onClick={showTokenList}
          disabled={disabled}
          data-testid={!!testId && getTokenSelectButtonTestId({ parentTestId: testId })}
        >
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
        </SelectButton>
      </TokenListWrapper>
    </div>
  );
};
