/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { forwardRef, useMemo } from 'react';

import { Token } from 'types';

import { ButtonProps, TertiaryButton } from '../Button';
import { TextField, TextFieldProps } from '../TextField';

export interface RightMaxButton extends Omit<ButtonProps, 'variant' | 'children' | 'small'> {
  label: string;
}

// Note: although we display all the values in tokens (equivalent of ether for the given token) to
// the user, the underlying values (maxMantissa, value) are expressed in mantissa to make them
// easier to use with contracts
export interface TokenTextFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'max' | 'min'> {
  token: Token;
  value: string;
  onChange: (newValue: string) => void;
  rightMaxButton?: RightMaxButton;
  displayTokenIcon?: boolean;
  max?: string;
}

export const TokenTextField: React.FC<TokenTextFieldProps> = forwardRef<
  HTMLInputElement,
  TokenTextFieldProps
>(
  (
    { token, rightMaxButton, onChange, disabled, max, displayTokenIcon = true, ...otherProps },
    ref,
  ) => {
    const step = useMemo(() => {
      const tmpOneTokenInMantissa = new BigNumber(10 ** token.decimals);
      const tmpOneMantissaInTokens = new BigNumber(1).dividedBy(tmpOneTokenInMantissa);

      return tmpOneMantissaInTokens.toFixed();
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
        ref={ref}
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
  },
);
