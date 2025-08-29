import type BigNumber from 'bignumber.js';

export const getSmartDecimalPlaces = ({
  value,
  maxDecimalPlaces,
}: {
  value: BigNumber;
  maxDecimalPlaces?: number;
}) => {
  const fixedValue =
    // Trim zeros
    Number.parseFloat(
      typeof maxDecimalPlaces === 'number'
        ? // Trim decimals according to maxDecimalPlaces value
          value.toFixed(maxDecimalPlaces ?? 0)
        : value.toFixed(),
    ).toString();

  const dotIndex = fixedValue.indexOf('.');

  if (dotIndex < 0) {
    return 0;
  }

  // Extract decimals
  const decimals = fixedValue.substring(dotIndex + 1);
  return decimals.length;
};
