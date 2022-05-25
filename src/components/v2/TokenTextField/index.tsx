/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

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
  tokenId: TokenId;
  value: string;
  onChange: (newValue: string) => void;
  rightMaxButton?: {
    label: string;
    valueOnClick: string;
  };
  max?: string;
}

export const TokenTextField: React.FC<ITokenTextFieldProps> = ({
  tokenId,
  rightMaxButton,
  onChange,
  disabled,
  max,
  ...otherProps
}) => {
  const tokenDecimals = getToken(tokenId).decimals;

  const step = React.useMemo(() => {
    const tmpOneCoinInWei = new BigNumber(10).pow(tokenDecimals);
    const tmpOneWeiInCoins = new BigNumber(1).dividedBy(tmpOneCoinInWei);

    return tmpOneWeiInCoins.toFixed();
  }, [tokenId]);

  const setMaxValue = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleChange: ITextFieldProps['onChange'] = ({ currentTarget: { value } }) => {
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
        rightMaxButton && onChange ? (
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
