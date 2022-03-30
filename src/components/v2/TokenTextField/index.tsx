/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { convertWeiToCoins, convertCoinsToWei, getTokenDecimals } from 'utilities/common';
import { TertiaryButton } from '../Button';
import { TextField, ITextFieldProps } from '../TextField';

// Note: although we display all the values in coins (equivalent of ether for
// the given token) to the user, the underlying values (maxWei, value) are
// expressed in wei to make them easier to use with contracts
export interface ITokenTextFieldProps
  extends Omit<ITextFieldProps, 'value' | 'onChange' | 'max' | 'min'> {
  tokenSymbol: keyof typeof CONTRACT_TOKEN_ADDRESS;
  onChange: (newValue: BigNumber | '') => void;
  rightMaxButtonLabel?: string;
  value: BigNumber | '';
  maxWei?: BigNumber;
}

export const TokenTextField: React.FC<ITokenTextFieldProps> = ({
  tokenSymbol,
  maxWei,
  rightMaxButtonLabel,
  value,
  onChange,
  disabled,
  ...otherProps
}) => {
  const step = React.useMemo(() => {
    const tmpTokenDecimals = getTokenDecimals(tokenSymbol);
    const tmpOneCoinInWei = new BigNumber(10).pow(tmpTokenDecimals);
    const tmpOneWeiInCoins = new BigNumber(1).dividedBy(tmpOneCoinInWei);

    return tmpOneWeiInCoins.toString();
  }, [tokenSymbol]);

  // Convert value passed in wei into coins (string)
  const readableValueCoins = value ? convertWeiToCoins({ value, tokenSymbol }).toString() : '';

  // Convert max passed in wei into coins (number)
  const maxCoins = React.useMemo(
    () => (maxWei ? convertWeiToCoins({ value: maxWei, tokenSymbol }).toNumber() : undefined),
    [maxWei],
  );

  const setMaxValue = () => {
    if (onChange && maxWei) {
      onChange(maxWei);
    }
  };

  const handleChange: ITextFieldProps['onChange'] = event => {
    const newValueWei =
      event.currentTarget.value &&
      // Convert value into wei
      convertCoinsToWei({
        value: new BigNumber(event.currentTarget.value),
        tokenSymbol,
      })
        // Remove decimal places, since we've converted the value into the
        // smallest possible unit we need to strip out any remaining fractions
        .decimalPlaces(0);

    onChange(newValueWei);
  };

  return (
    <TextField
      placeholder="0.00"
      value={readableValueCoins}
      onChange={handleChange}
      min={0}
      max={maxCoins}
      step={step}
      type="number"
      rightAdornment={
        rightMaxButtonLabel && onChange && maxWei ? (
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
