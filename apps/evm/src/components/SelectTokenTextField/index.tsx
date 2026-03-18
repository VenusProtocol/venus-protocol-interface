/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useState } from 'react';

import { TertiaryButton } from '@venusprotocol/ui';
import type { Token } from 'types';
import { Icon } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import { type OptionalTokenBalance, TokenListWrapper } from '../TokenListWrapper';
import { TokenTextField, type TokenTextFieldProps } from '../TokenTextField';
import { useStyles } from './styles';
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
  const styles = useStyles();
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
          displayTokenIcon={false}
          leftAdornment={
            <TertiaryButton
              onClick={handleButtonClick}
              css={styles.getButton({ isTokenListShown })}
              className="pl-2 pr-1 max-w-34 min-w-0"
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
                css={styles.getArrowIcon({ isTokenListShown })}
                name="arrowUp"
                className="w-5 h-5 ml-1 shrink-0"
              />
            </TertiaryButton>
          }
          rightAdornment={
            rightMaxButton && (
              <TertiaryButton
                disabled={disabled}
                css={styles.maxButton}
                data-testid={!!testId && getTokenMaxButtonTestId({ parentTestId: testId })}
                size="sm"
                className="px-2"
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

      <Typography variant="small2" css={styles.description}>
        {description}
      </Typography>
    </div>
  );
};
