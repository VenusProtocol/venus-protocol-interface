/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import React from 'react';
import { Token } from 'types';

import { ButtonProps, TertiaryButton } from '../Button';
import { TextField, TextFieldProps } from '../TextField';

export interface RightMaxButton extends Omit<ButtonProps, 'variant' | 'children' | 'small'> {
  label: string;
}

// Note: although we display all the values in tokens (equivalent of ether for
// the given token) to the user, the underlying values (maxWei, value) are
// expressed in wei to make them easier to use with contracts
export interface TokenTextFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'max' | 'min'> {
  token: Token;
  value: string;
  onChange: (newValue: string) => void;
  rightMaxButton?: RightMaxButton;
  displayTokenIcon?: boolean;
  max?: string;
}

export const TokenTextField: React.FC<TokenTextFieldProps> = ({
  token,
  rightMaxButton,
  onChange,
  disabled,
  max,
  displayTokenIcon = true,
  ...otherProps
}) => {
  const step = React.useMemo(() => {
    const tmpOneTokenInWei = new BigNumber(10).pow(token.decimals);
    const tmpOneWeiInTokens = new BigNumber(1).dividedBy(tmpOneTokenInWei);

    return tmpOneWeiInTokens.toFixed();
  }, [token.decimals]);

  const handleChange: TextFieldProps['onChange'] = ({ currentTarget: { value } }) => {
    // Forbid values with more decimals than the token provided supports
    const valueDecimals = value.includes('.') ? value.split('.')[1].length : 0;

    if (valueDecimals <= token.decimals) {
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
      leftIconSrc={displayTokenIcon ? token : undefined}
      rightAdornment={
        rightMaxButton ? (
          <TertiaryButton disabled={disabled} {...rightMaxButton}>
            {rightMaxButton.label}
          </TertiaryButton>
        ) : undefined
      }
      disabled={disabled}
      {...otherProps}
    />
  );
};
