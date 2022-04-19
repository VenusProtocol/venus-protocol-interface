/** @jsxImportSource @emotion/react */
import React from 'react';

import { TokenId } from 'types';
import { getToken } from 'utilities';
import { IconName } from '../Icon';
import { TertiaryButton } from '../Button';
import { TextField, ITextFieldProps } from '../TextField';

// Note: although we display all the values in tokens (equivalent of ether for
// the given token) to the user, the underlying values (maxWei, value) are
// expressed in wei to make them easier to use with contracts
export interface ITokenTextFieldProps
  extends Omit<ITextFieldProps, 'onChange' | 'value' | 'max' | 'min'> {
  tokenSymbol: TokenId;
  value: string;
  onChange: (newValue: string) => void;
  rightMaxButtonLabel?: string;
  max?: string;
}

export const TokenTextField: React.FC<ITokenTextFieldProps> = ({
  tokenSymbol,
  rightMaxButtonLabel,
  onChange,
  disabled,
  max,
  ...otherProps
}) => {
  const setMaxValue = () => {
    if (onChange && max) {
      onChange(max);
    }
  };

  const handleChange: ITextFieldProps['onChange'] = ({ currentTarget: { value } }) => {
    // Format value so it doesn't have more decimals places than the token has
    const tokenDecimals = getToken(tokenSymbol).decimals;
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
      onChange={handleChange}
      type="number"
      leftIconName={tokenSymbol as IconName}
      rightAdornment={
        rightMaxButtonLabel && onChange && max ? (
          <TertiaryButton onClick={setMaxValue} small disabled={disabled}>
            {rightMaxButtonLabel}
          </TertiaryButton>
        ) : undefined
      }
      disabled={disabled}
      {...otherProps}
    />
  );
};
