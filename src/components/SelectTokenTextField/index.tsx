/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { TokenId } from 'types';

import { PrimaryButton } from '../Button';
import { Icon } from '../Icon';
import { Token } from '../Token';
import { TokenTextField, TokenTextFieldProps } from '../TokenTextField';
import TokenList from './TokenList';
import { useStyles } from './styles';
import { TokenBalance } from './types';

export * from './types';

export interface SelectTokenTextFieldProps
  extends Omit<TokenTextFieldProps, 'rightMaxButton' | 'max'> {
  tokenBalances: TokenBalance[];
  onChangeSelectedToken: (tokenId: TokenId) => void;
}

export const SelectTokenTextField: React.FC<SelectTokenTextFieldProps> = ({
  tokenId,
  disabled,
  tokenBalances,
  onChangeSelectedToken,
  className,
  ...otherTokenTextFieldProps
}) => {
  const styles = useStyles();
  const [isTokenListShown, setIsTokenListShown] = useState(false);

  const handleButtonClick = () => setIsTokenListShown(isShowing => !isShowing);

  const handleChangeSelectedToken = (selectedTokenId: TokenId) => {
    setIsTokenListShown(false);
    onChangeSelectedToken(selectedTokenId);
  };

  return (
    <div css={styles.container} className={className}>
      <TokenTextField
        tokenId={tokenId}
        disabled={disabled}
        displayTokenIcon={false}
        rightAdornment={
          <>
            <PrimaryButton
              onClick={handleButtonClick}
              small
              css={styles.getButton({ isTokenListShown })}
              disabled={disabled}
            >
              <Token tokenId={tokenId} css={styles.token} />

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
        <TokenList tokenBalances={tokenBalances} onTokenClick={handleChangeSelectedToken} />
      )}
    </div>
  );
};
