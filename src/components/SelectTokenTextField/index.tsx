/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { Token, TokenBalance } from 'types';

import { PrimaryButton, TertiaryButton } from '../Button';
import { Icon } from '../Icon';
import { TokenIconWithSymbol } from '../TokenIconWithSymbol';
import { TokenTextField, TokenTextFieldProps } from '../TokenTextField';
import TokenList from './TokenList';
import { useStyles } from './styles';
import {
  getTokenMaxButtonTestId,
  getTokenSelectButtonTestId,
  getTokenTextFieldTestId,
} from './testIdGetters';

export interface SelectTokenTextFieldProps extends Omit<TokenTextFieldProps, 'max' | 'token'> {
  selectedToken: Token;
  tokenBalances: TokenBalance[];
  onChangeSelectedToken: (token: Token) => void;
  'data-testid'?: string;
}

export const SelectTokenTextField: React.FC<SelectTokenTextFieldProps> = ({
  selectedToken,
  disabled,
  tokenBalances,
  onChange,
  onChangeSelectedToken,
  className,
  value,
  rightMaxButton,
  'data-testid': testId,
  ...otherTokenTextFieldProps
}) => {
  const styles = useStyles();
  const [isTokenListShown, setIsTokenListShown] = useState(false);

  const handleButtonClick = () => setIsTokenListShown(isShowing => !isShowing);

  const handleChangeSelectedToken = (newSelectedToken: Token) => {
    setIsTokenListShown(false);
    onChangeSelectedToken(newSelectedToken);
  };

  const setMaxValue = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={className}>
      <TokenTextField
        token={selectedToken}
        disabled={disabled}
        displayTokenIcon={false}
        value={value}
        onChange={onChange}
        rightAdornment={
          <>
            <PrimaryButton
              onClick={handleButtonClick}
              small
              css={styles.getButton({ isTokenListShown })}
              disabled={disabled}
              data-testid={!!testId && getTokenSelectButtonTestId({ parentTestId: testId })}
            >
              <TokenIconWithSymbol token={selectedToken} css={styles.token} />

              <Icon css={styles.getArrowIcon({ isTokenListShown })} name="arrowUp" />
            </PrimaryButton>

            {rightMaxButton && (
              <TertiaryButton
                onClick={() => setMaxValue(rightMaxButton.valueOnClick)}
                small
                disabled={disabled}
                css={styles.maxButton}
                data-testid={!!testId && getTokenMaxButtonTestId({ parentTestId: testId })}
              >
                {rightMaxButton.label}
              </TertiaryButton>
            )}
          </>
        }
        data-testid={!!testId && getTokenTextFieldTestId({ parentTestId: testId })}
        {...otherTokenTextFieldProps}
      />

      <div
        css={styles.getBackdrop({ isTokenListShown })}
        onClick={() => setIsTokenListShown(false)}
      />

      <div css={styles.tokenListContainer}>
        {isTokenListShown && (
          <TokenList
            tokenBalances={tokenBalances}
            data-testid={testId}
            onTokenClick={handleChangeSelectedToken}
          />
        )}
      </div>
    </div>
  );
};
