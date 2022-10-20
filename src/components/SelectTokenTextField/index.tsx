/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { TokenId } from 'types';

import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';

import { PrimaryButton } from '../Button';
import { Icon } from '../Icon';
import { Token } from '../Token';
import { TokenTextField, TokenTextFieldProps } from '../TokenTextField';
import TokenList from './TokenList';
import { useStyles } from './styles';

export interface SelectTokenTextFieldUiProps
  extends Omit<TokenTextFieldProps, 'rightMaxButton' | 'max' | 'tokenId'> {
  selectedTokenId: TokenId;
  tokenIds: TokenId[];
  onChangeSelectedToken: (tokenId: TokenId) => void;
  userTokenBalanceWei?: BigNumber;
}

export const SelectTokenTextFieldUi: React.FC<SelectTokenTextFieldUiProps> = ({
  selectedTokenId,
  disabled,
  tokenIds,
  onChangeSelectedToken,
  className,
  userTokenBalanceWei,
  value,
  ...otherTokenTextFieldProps
}) => {
  const styles = useStyles();
  const { Trans } = useTranslation();
  const [isTokenListShown, setIsTokenListShown] = useState(false);

  const handleButtonClick = () => setIsTokenListShown(isShowing => !isShowing);

  const handleChangeSelectedToken = (newSelectedTokenId: TokenId) => {
    setIsTokenListShown(false);
    onChangeSelectedToken(newSelectedTokenId);
  };

  const readableTokenWalletBalance = useConvertWeiToReadableTokenString({
    valueWei: userTokenBalanceWei,
    tokenId: selectedTokenId,
  });

  return (
    <div className={className}>
      <div css={styles.tokenTextFieldContainer}>
        <TokenTextField
          tokenId={selectedTokenId}
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
                <Token tokenId={selectedTokenId} css={styles.token} />

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

        {isTokenListShown && (
          <TokenList tokenIds={tokenIds} onTokenClick={handleChangeSelectedToken} />
        )}
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

export type SelectTokenTextFieldProps = SelectTokenTextFieldUiProps;

export const SelectTokenTextField: React.FC<SelectTokenTextFieldProps> = ({
  selectedTokenId,
  ...otherProps
}) => {
  // TODO: fetch
  const userTokenBalanceWei = new BigNumber('100000000000000');

  return (
    <SelectTokenTextFieldUi
      selectedTokenId={selectedTokenId}
      userTokenBalanceWei={userTokenBalanceWei}
      {...otherProps}
    />
  );
};
