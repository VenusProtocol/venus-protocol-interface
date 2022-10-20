/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import { PrimaryButton } from '../Button';
import { Icon } from '../Icon';
import { TokenIcon } from '../TokenIcon';
import { TokenTextField, TokenTextFieldProps } from '../TokenTextField';
import TokenList from './TokenList';
import { useStyles } from './styles';

export interface SelectTokenTextFieldProps
  extends Omit<TokenTextFieldProps, 'rightMaxButton' | 'max' | 'tokenId'> {
  selectedTokenId: TokenId;
  tokenIds: TokenId[];
  onChangeSelectedTokenId: (tokenId: TokenId) => void;
  userTokenBalanceWei?: BigNumber;
}

export const SelectTokenTextField: React.FC<SelectTokenTextFieldProps> = ({
  selectedTokenId,
  disabled,
  tokenIds,
  onChangeSelectedTokenId,
  className,
  userTokenBalanceWei,
  value,
  ...otherTokenTextFieldProps
}) => {
  const styles = useStyles();
  const { Trans } = useTranslation();
  const [isTokenListShown, setIsTokenListShown] = useState(false);

  const handleButtonClick = () => setIsTokenListShown(isShowing => !isShowing);

  const handleChangeSelectedToken = (newSelectedToken: Token) => {
    setIsTokenListShown(false);
    onChangeSelectedTokenId(newSelectedTokenId);
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
              >
                <TokenIcon token={selectedToken} css={styles.token} showSymbol />

                <Icon css={styles.getArrowIcon({ isTokenListShown })} name="arrowUp" />
              </PrimaryButton>
            </>
          }
          {...otherTokenTextFieldProps}
        />

        <div
          css={styles.getBackdrop({ isTokenListShown })}
          onClick={() => setIsTokenListShown(false)}
        />

        <div css={styles.tokenListContainer}>
          {isTokenListShown && (
            <TokenList tokenIds={tokenIds} onTokenClick={handleChangeSelectedToken} />
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
