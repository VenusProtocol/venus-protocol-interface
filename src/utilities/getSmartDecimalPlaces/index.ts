import BigNumber from 'bignumber.js';

const getSmartDecimalPlaces = ({
  value,
  minDecimalPlaces = 0,
  maxDecimalPlaces,
}: {
  value: BigNumber;
  minDecimalPlaces?: number;
  maxDecimalPlaces?: number;
}) => {
  const fixedValue = value.toFixed();
  const dotIndex = fixedValue.indexOf('.');

  if (dotIndex < 0) {
    return minDecimalPlaces;
  }

  let decimals = fixedValue.substring(dotIndex + 1);

  // Max decimals to maxDecimalPlaces value
  if (maxDecimalPlaces) {
    decimals = decimals.substring(0, maxDecimalPlaces);
  }

  const firstNonZeroDecimalIndex = decimals.split('').findIndex(decimal => decimal !== '0');

  const decimalPlaces =
    // If the decimal next to the first non-zero decimal found is also a non-zero, we increment the
    // decimal places by one to include it in the final amount
    decimals[firstNonZeroDecimalIndex + 1] && decimals[firstNonZeroDecimalIndex + 1] !== '0'
      ? firstNonZeroDecimalIndex + 2
      : firstNonZeroDecimalIndex + 1;

  // Floor decimal places to minDecimalPlaces value
  return !!minDecimalPlaces && decimalPlaces < minDecimalPlaces ? minDecimalPlaces : decimalPlaces;
};

export default getSmartDecimalPlaces;
