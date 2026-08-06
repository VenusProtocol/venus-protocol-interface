import { useState } from 'react';

import { TertiaryButton, cn } from '@venusprotocol/ui';
import { type OptionalTokenBalance, TokenListWrapper } from 'containers/TokenListWrapper';
import type { Token } from 'types';
import { Icon } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import { TokenTextField, type TokenTextFieldProps } from '../TokenTextField';
import {
  getTokenMaxButtonTestId,
  getTokenSelectButtonTestId,
  getTokenTextFieldTestId,
} from './testIdGetters';

export interface SelectTokenTextFieldProps extends Omit<TokenTextFieldProps, 'max' | 'token'> {
  tokenBalances: OptionalTokenBalance[];
  selectedToken: Token;
  onChangeSelectedToken: (token: Token) => void;
  token?: Token;
  displayCommonTokenButtons?: boolean;
  'data-testid'?: string;
}

export const SelectTokenTextField: React.FC<SelectTokenTextFieldProps> = ({
  selectedToken,
  disabled,
  tokenBalances,
  onChangeSelectedToken,
  className,
  value,
  rightMaxButton,
  'data-testid': testId,
  description,
  displayCommonTokenButtons = false,
  ...otherTokenTextFieldProps
}) => {
  const [isTokenListShown, setIsTokenListShown] = useState(false);

  const handleButtonClick = () => setIsTokenListShown(isShowing => !isShowing);

  return (
    <div className={className} data-testid={testId}>
      <TokenListWrapper
        onTokenClick={onChangeSelectedToken}
        tokenBalances={tokenBalances}
        onClose={() => setIsTokenListShown(false)}
        isListShown={isTokenListShown}
        selectedToken={selectedToken}
        data-testid={testId}
      >
        <TokenTextField
          token={selectedToken}
          disabled={disabled}
          value={value}
          displayTokenIcon={tokenBalances.length <= 1}
          leftAdornment={
            tokenBalances.length > 1 ? (
              <TertiaryButton
                onClick={handleButtonClick}
                className={cn(
                  'pl-2 pr-1 max-w-34 min-w-0',
                  isTokenListShown && 'relative z-10 border-blue hover:border-blue',
                )}
                contentClassName="min-w-0"
                variant="tertiary"
                disabled={disabled}
                data-testid={!!testId && getTokenSelectButtonTestId({ parentTestId: testId })}
                size="sm"
              >
                <div className="flex min-w-0 grow items-center gap-x-2 overflow-hidden">
                  <TokenIcon token={selectedToken} className="h-5 w-5 shrink-0" />

                  <div className="min-w-0 grow truncate leading-none">{selectedToken.symbol}</div>
                </div>

                <Icon
                  name="arrowUp"
                  className={cn(
                    'w-5 h-5 ml-1 shrink-0 text-inherit transition-colors duration-300',
                    !isTokenListShown && 'rotate-180',
                    isTokenListShown && 'text-blue',
                  )}
                />
              </TertiaryButton>
            ) : undefined
          }
          rightAdornment={
            rightMaxButton && (
              <TertiaryButton
                disabled={disabled}
                data-testid={!!testId && getTokenMaxButtonTestId({ parentTestId: testId })}
                size="sm"
                className="ml-2 whitespace-nowrap px-2"
                {...rightMaxButton}
              >
                {rightMaxButton.label}
              </TertiaryButton>
            )
          }
          data-testid={!!testId && getTokenTextFieldTestId({ parentTestId: testId })}
          {...otherTokenTextFieldProps}
        />
      </TokenListWrapper>

      {!!description && <p className="m-0 mt-1 block text-b1r text-grey">{description}</p>}
    </div>
  );
};
