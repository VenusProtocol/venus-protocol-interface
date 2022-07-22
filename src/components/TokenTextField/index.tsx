/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React from 'react';
import { TokenId } from 'types';
import { getToken } from 'utilities';

import { TertiaryButton } from '../Button';
import { IconName } from '../Icon';
import { TextField, TextFieldProps } from '../TextField';

// Note: although we display all the values in tokens (equivalent of ether for
// the given token) to the user, the underlying values (maxWei, value) are
// expressed in wei to make them easier to use with contracts
export interface TokenTextFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'max' | 'min'> {
  tokenId: TokenId;
  value: string;
  onChange: (newValue: string) => void;
  rightMaxButton?: {
    label: string;
    valueOnClick: string;
  };
  max?: string;
}

export const TokenTextField: React.FC<TokenTextFieldProps> = ({
  tokenId,
  rightMaxButton,
  onChange,
  disabled,
  max,
  ...otherProps
}) => {
  const tokenDecimals = getToken(tokenId).decimals;

  const step = React.useMemo(() => {
    const tmpOneTokenInWei = new BigNumber(10).pow(tokenDecimals);
    const tmpOneWeiInTokens = new BigNumber(1).dividedBy(tmpOneTokenInWei);

    return tmpOneWeiInTokens.toFixed();
  }, [tokenId]);

  const setMaxValue = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleChange: TextFieldProps['onChange'] = ({ currentTarget: { value } }) => {
    // Forbid values with more decimals than the token provided supports
    const valueDecimals = value.includes('.') ? value.split('.')[1].length : 0;

    if (valueDecimals <= tokenDecimals) {
      onChange(value);
    }
  };

  return (
    <TextField
      placeholder="0.00"
      min={0}
      max={max}
      step={step}
      onChange={handleChange}
      type="number"
      leftIconName={tokenId as IconName}
      rightAdornment={
        rightMaxButton ? (
          <TertiaryButton
            onClick={() => setMaxValue(rightMaxButton.valueOnClick)}
            small
            disabled={disabled}
          >
            {rightMaxButton.label}
          </TertiaryButton>
        ) : undefined
      }
      disabled={disabled}
      {...otherProps}
    />
  );
};
