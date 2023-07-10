import BigNumber from 'bignumber.js';

import shortenValueWithSuffix from '..';

describe('utilities/shortenValueWithSuffix', () => {
  test('should return a formatted value in billions with "B" suffix when value is greater or equal to one billion', () => {
    const value = new BigNumber(1500000000);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('1.50B');
  });

  test('should return a formatted value in millions with "M" suffix when value is greater or equal to one million and less than one billion', () => {
    const value = new BigNumber(1500000);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('1.50M');
  });

  test('should return a formatted value in thousands with "K" suffix when value is greater or equal to one thousand and less than one million', () => {
    const value = new BigNumber(1500);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('1.50K');
  });

  test('should return "0" when value is zero and outputsDollars is false', () => {
    const value = new BigNumber(0);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('0');
  });

  test('should return formatted value without any suffix when value is less than one thousand and greater or equal to 0', () => {
    const value = new BigNumber(500);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('500.00');
  });

  test('should return formatted value with at least three decimal places when passing minDecimalPlaces as 3', () => {
    const value = new BigNumber(100);
    const result = shortenValueWithSuffix({
      value,
      minDecimalPlaces: 3,
    });
    expect(result).toEqual('100.000');
  });

  test('should return formatted value with maximum three decimal places when passing maxDecimalPlaces as 3', () => {
    const value = new BigNumber('100.1827863561');
    const result = shortenValueWithSuffix({
      value,
      minDecimalPlaces: 3,
    });
    expect(result).toEqual('100.182');
  });
});
