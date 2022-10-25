/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import { PrimaryButton } from '../Button';
import { Icon } from '../Icon';
import { TokenIconWithSymbol } from '../TokenIconWithSymbol';
import { TokenTextField, TokenTextFieldProps } from '../TokenTextField';
import TokenList from './TokenList';
import { useStyles } from './styles';
import { getTokenSelectButtonTestId, getTokenTextFieldTestId } from './testIdGetters';

export interface SelectTokenTextFieldProps
  extends Omit<TokenTextFieldProps, 'rightMaxButton' | 'max' | 'token'> {
  selectedToken: Token;
  tokens: Token[];
  onChangeSelectedToken: (token: Token) => void;
  userTokenBalanceWei?: BigNumber;
  'data-testid'?: string;
}

export const SelectTokenTextField: React.FC<SelectTokenTextFieldProps> = ({
  selectedToken,
  disabled,
  tokens,
  onChangeSelectedToken,
  className,
  userTokenBalanceWei,
  value,
  'data-testid': testId,
  ...otherTokenTextFieldProps
}) => {
  const styles = useStyles();
  const { Trans } = useTranslation();
  const [isTokenListShown, setIsTokenListShown] = useState(false);

  const handleButtonClick = () => setIsTokenListShown(isShowing => !isShowing);

  const handleChangeSelectedToken = (newSelectedToken: Token) => {
    setIsTokenListShown(false);
    onChangeSelectedToken(newSelectedToken);
  };

  const readableTokenWalletBalance = useConvertWeiToReadableTokenString({
    valueWei: userTokenBalanceWei,
    token: selectedToken,
  });

  return (
    <div className={className}>
      <div css={styles.tokenTextFieldContainer}>
        <TokenTextField
          token={selectedToken}
          disabled={disabled}
          displayTokenIcon={false}
          value={value}
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
              tokens={tokens}
              data-testid={testId}
              onTokenClick={handleChangeSelectedToken}
            />
          )}
        </div>
      </div>

      <Typography component="div" variant="small2" css={styles.greyLabel}>
        <Trans
          i18nKey="selectTokenTextField.walletBalance"
          components={{
            White: <span css={styles.whiteLabel} />,
          }}
          values={{
            balance: readableTokenWalletBalance,
          }}
        />
      </Typography>
    </div>
  );
};
