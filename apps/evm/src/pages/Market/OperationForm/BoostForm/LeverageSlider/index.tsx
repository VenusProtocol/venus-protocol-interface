import BigNumber from 'bignumber.js';
import { useState } from 'react';

import {
  LabeledInlineContent,
  Slider,
  TextField,
  type TextFieldProps,
  ValueUpdate,
} from 'components';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import { formatTokensToReadableValue, getDecimals } from 'utilities';

const MAX_LEVERAGE_FACTOR_DECIMALS = 1;

export interface LeverageSliderProps {
  fromAsset: Asset;
  toAsset: Asset;
  value: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
}

export const LeverageSlider: React.FC<LeverageSliderProps> = ({
  value,
  fromAsset,
  toAsset,
  onChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isLeverageFactorInputFocused, setIsLeverageFactorInputFocused] = useState(false);

  const maxLeverageFactor = Number(
    new BigNumber(1 / (1 - toAsset.userCollateralFactor)).toFixed(1, BigNumber.ROUND_DOWN),
  );

  const step = maxLeverageFactor / 5;
  const steps = [];

  for (let v = 0; v < maxLeverageFactor + 0.0001; v += step) {
    steps.push(Number(v.toFixed(1)));
  }

  steps[steps.length - 1] = maxLeverageFactor;

  const handleChange: TextFieldProps['onChange'] = ({ currentTarget: { value } }) => {
    const valueDecimals = getDecimals({ value });

    if (valueDecimals <= MAX_LEVERAGE_FACTOR_DECIMALS) {
      onChange(value);
    }
  };

  return (
    <div className="space-y-4">
      <LabeledInlineContent
        label={t('operationForm.leverage.label')}
        tooltip={t('operationForm.leverage.tooltip')}
      >
        <TextField
          disabled={disabled}
          onChange={handleChange}
          onFocus={() => setIsLeverageFactorInputFocused(true)}
          onBlur={() => setIsLeverageFactorInputFocused(false)}
          value={isLeverageFactorInputFocused ? value : `${value || 0}x`}
          step={0.1}
          variant="tertiary"
          size="xxs"
          className="w-[54px]"
          type={isLeverageFactorInputFocused ? 'number' : 'string'}
          min={0}
          max={maxLeverageFactor}
        />
      </LabeledInlineContent>

      <div className="space-y-2">
        <Slider
          disabled={disabled}
          value={Number(value)}
          onChange={value => onChange(String(value))}
          max={maxLeverageFactor}
          step={0.1}
        />

        <div className="flex justify-between">
          {steps.map(step => (
            <p className="text-grey text-xs">{step}x</p>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <LabeledInlineContent
          label={t('operationForm.supplyBalance', {
            tokenSymbol: toAsset.vToken.underlyingToken.symbol,
          })}
          iconSrc={toAsset.vToken.underlyingToken}
        >
          <ValueUpdate
            original={formatTokensToReadableValue({
              value: toAsset.userSupplyBalanceTokens,
              token: toAsset.vToken.underlyingToken,
              addSymbol: false,
            })}
            // TODO: add hypothetical supply balance
          />
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('operationForm.borrowBalance', {
            tokenSymbol: fromAsset.vToken.underlyingToken.symbol,
          })}
          iconSrc={fromAsset.vToken.underlyingToken}
        >
          <ValueUpdate
            original={formatTokensToReadableValue({
              value: fromAsset.userBorrowBalanceTokens,
              token: fromAsset.vToken.underlyingToken,
              addSymbol: false,
            })}
            // TODO: add hypothetical borrow balance
          />
        </LabeledInlineContent>
      </div>
    </div>
  );
};
