/** @jsxImportSource @emotion/react */
import { type ButtonProps, TertiaryButton } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { forwardRef, useMemo } from 'react';

import type { Token } from 'types';

import { useTranslation } from 'libs/translations';
import formatCentsToReadableValue from 'utilities/formatCentsToReadableValue';
import { getDecimals } from 'utilities/getDecimals';
import { TextField, type TextFieldProps } from '../TextField';

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
  tokenPriceCents?: number;
  max?: string;
}

export const TokenTextField: React.FC<TokenTextFieldProps> = forwardRef<
  HTMLInputElement,
  TokenTextFieldProps
>(
  (
    {
      token,
      rightMaxButton,
      onChange,
      disabled,
      max,
      displayTokenIcon = true,
      topRightAdornment,
      tokenPriceCents,
      value,
      ...otherProps
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const step = useMemo(() => {
      const tmpOneTokenInMantissa = new BigNumber(10 ** token.decimals);
      const tmpOneMantissaInTokens = new BigNumber(1).dividedBy(tmpOneTokenInMantissa);

      return tmpOneMantissaInTokens.toFixed();
    }, [token.decimals]);

    const handleChange: TextFieldProps['onChange'] = ({ currentTarget: { value: newValue } }) => {
      // Forbid values with more decimals than the token provided supports
      const valueDecimals = getDecimals({ value: newValue });

      if (valueDecimals <= token.decimals) {
        onChange(newValue);
      }
    };

    const readableValueDollars =
      value && typeof tokenPriceCents === 'number'
        ? formatCentsToReadableValue({
            value: new BigNumber(value).multipliedBy(tokenPriceCents),
          })
        : undefined;

    return (
      <TextField
        ref={ref}
        placeholder="0.00"
        min={0}
        max={max}
        step={step}
        onChange={handleChange}
        type="number"
        value={value}
        leftIconSrc={displayTokenIcon ? token : undefined}
        topRightAdornment={
          topRightAdornment || typeof tokenPriceCents === 'number' ? (
            <div className="flex items-center gap-x-2">
              {tokenPriceCents && readableValueDollars ? (
                <p className="text-light-grey text-b1r">
                  {t('tokenTextField.valueDollars', {
                    value: readableValueDollars,
                  })}
                </p>
              ) : (
                <div className="h-5.25" />
              )}

              {topRightAdornment}
            </div>
          ) : undefined
        }
        rightAdornment={
          rightMaxButton ? (
            <TertiaryButton size="sm" className="px-2" disabled={disabled} {...rightMaxButton}>
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
