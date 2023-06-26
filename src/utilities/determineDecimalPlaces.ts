import BigNumber from 'bignumber.js';

const determineDecimalPlaces = (value: BigNumber) => {
  const fixedValue = value.toFixed();
  const dotIndex = fixedValue.indexOf('.');

  if (dotIndex < 0) {
    return 2;
  }

  const decimals = fixedValue.substring(dotIndex + 1);
  const firstNonZeroDecimalIndex = decimals.split('').findIndex(decimal => decimal !== '0');

  const decimalPlaces =
    // If the decimal next to the first non-zero decimal found is also a
    // non-zero, we increment the decimal places by one to include it in the
    // final amount
    decimals[firstNonZeroDecimalIndex + 1] !== '0'
      ? firstNonZeroDecimalIndex + 2
      : firstNonZeroDecimalIndex + 1;

  return decimalPlaces < 2 ? 2 : decimalPlaces;
};

export default determineDecimalPlaces;
