import {
  MAXIMUM_SLIPPAGE_TOLERANCE_PERCENTAGE,
  MINIMUM_SLIPPAGE_TOLERANCE_PERCENTAGE,
} from 'constants/swap';
import { getDecimals } from 'utilities';

const MAX_SLIPPAGE_TOLERANCE_DECIMALS = 2;

export const validateSlippageTolerancePercentage = (value: string) => {
  if (!value) {
    return false;
  }

  const parsedValue = Number(value);

  // Forbid values with more 2 decimals
  const valueDecimals = getDecimals({ value });

  return (
    Number.isFinite(parsedValue) &&
    valueDecimals <= MAX_SLIPPAGE_TOLERANCE_DECIMALS &&
    parsedValue >= MINIMUM_SLIPPAGE_TOLERANCE_PERCENTAGE &&
    parsedValue <= MAXIMUM_SLIPPAGE_TOLERANCE_PERCENTAGE
  );
};
