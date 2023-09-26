import BigNumber from 'bignumber.js';

import { shortenValueWithSuffix } from '..';

describe('shortenValueWithSuffix', () => {
  it('should return a formatted value in billions with "T" suffix when value is greater or equal to one trillion', () => {
    const value = new BigNumber(1500000000000);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('1.5T');
  });

  it('should return a formatted value in billions with "B" suffix when value is greater or equal to one billion', () => {
    const value = new BigNumber(1500000000);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('1.5B');
  });

  it('should return a formatted value in millions with "M" suffix when value is greater or equal to one million and less than one billion', () => {
    const value = new BigNumber(1500000);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('1.5M');
  });

  it('should return a formatted value in thousands with "K" suffix when value is greater or equal to one thousand and less than one million', () => {
    const value = new BigNumber(1500);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('1.5K');
  });

  it('should return "0" when value is zero and outputsDollars is false', () => {
    const value = new BigNumber(0);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('0');
  });

  it('should return formatted value without any suffix when value is less than one thousand and greater or equal to 0', () => {
    const value = new BigNumber(500);
    const result = shortenValueWithSuffix({
      value,
    });
    expect(result).toEqual('500');
  });

  it('should return formatted value with at least three decimal places when passing minDecimalPlaces as 3', () => {
    const value = new BigNumber(100);
    const result = shortenValueWithSuffix({
      value,
      minDecimalPlaces: 3,
    });
    expect(result).toEqual('100.000');
  });

  it('should return formatted value with maximum three decimal places when passing maxDecimalPlaces as 3', () => {
    const value = new BigNumber('100.0012321');
    const result = shortenValueWithSuffix({
      value,
      maxDecimalPlaces: 3,
    });
    expect(result).toEqual('100.001');
  });
});
