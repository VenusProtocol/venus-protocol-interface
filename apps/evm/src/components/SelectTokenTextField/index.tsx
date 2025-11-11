/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useState } from 'react';

import type { Token } from 'types';

import { TertiaryButton } from '@venusprotocol/ui';
import { Icon } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import { TokenTextField, type TokenTextFieldProps } from '../TokenTextField';
import TokenList from './TokenList';
import { useStyles } from './styles';
import {
  getTokenMaxButtonTestId,
  getTokenSelectButtonTestId,
  getTokenTextFieldTestId,
} from './testIdGetters';
import type { OptionalTokenBalance } from './types';

export * from './types';

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
  onChange,
  onChangeSelectedToken,
  className,
  value,
  rightMaxButton,
  'data-testid': testId,
  description,
  displayCommonTokenButtons = false,
  ...otherTokenTextFieldProps
}) => {
  const styles = useStyles();
  const [isTokenListShown, setIsTokenListShown] = useState(false);

  const handleButtonClick = () => setIsTokenListShown(isShowing => !isShowing);

  const handleChangeSelectedToken = (newSelectedToken: Token) => {
    setIsTokenListShown(false);
    onChangeSelectedToken(newSelectedToken);
  };

  return (
    <div className={className} data-testid={testId}>
      <TokenTextField
        token={selectedToken}
        disabled={disabled}
        displayTokenIcon={false}
        value={value}
        onChange={onChange}
        rightAdornment={
          <>
            <TertiaryButton
              onClick={handleButtonClick}
              css={styles.getButton({ isTokenListShown })}
              className="p-2"
              disabled={disabled}
              data-testid={!!testId && getTokenSelectButtonTestId({ parentTestId: testId })}
            >
              <div className="flex items-center gap-x-2">
                <TokenIcon token={selectedToken} className="h-5 w-5" />

                <div className="text-left">{selectedToken.symbol}</div>
              </div>

              <Icon
                css={styles.getArrowIcon({ isTokenListShown })}
                name="arrowUp"
                className="w-5 h-5"
              />
            </TertiaryButton>

            {rightMaxButton && (
              <TertiaryButton
                disabled={disabled}
                css={styles.maxButton}
                data-testid={!!testId && getTokenMaxButtonTestId({ parentTestId: testId })}
                {...rightMaxButton}
              >
                {rightMaxButton.label}
              </TertiaryButton>
            )}
          </>
        }
        data-testid={!!testId && getTokenTextFieldTestId({ parentTestId: testId })}
        {...otherTokenTextFieldProps}
      />

      <div css={styles.tokenListContainer}>
        {isTokenListShown && (
          <TokenList
            tokenBalances={tokenBalances}
            data-testid={testId}
            onTokenClick={handleChangeSelectedToken}
            selectedToken={selectedToken}
            displayCommonTokenButtons={displayCommonTokenButtons}
          />
        )}
      </div>

      <Typography variant="small2" css={styles.description}>
        {description}
      </Typography>

      <div
        css={styles.getBackdrop({ isTokenListShown })}
        onClick={() => setIsTokenListShown(false)}
      />
    </div>
  );
};
