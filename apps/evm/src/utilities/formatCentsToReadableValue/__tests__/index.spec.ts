import BigNumber from 'bignumber.js';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import formatCentsToReadableValue, { type FormatCentsToReadableValueInput } from '..';

describe('utilities/formatCentsToReadableValue', () => {
  it('should return PLACEHOLDER_KEY when value is undefined', () => {
    const input: FormatCentsToReadableValueInput = {
      value: undefined,
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual(PLACEHOLDER_KEY);
  });

  it('should return 0 values correctly', () => {
    const result = formatCentsToReadableValue({
      value: 0,
    });
    expect(result).toEqual('$0');

    const negativeResult = formatCentsToReadableValue({
      shorten: false,
      value: 0,
    });
    expect(negativeResult).toEqual('$0');
  });

  it('should format dollar values correctly', () => {
    const result = formatCentsToReadableValue({
      value: new BigNumber(1235678),
    });

    expect(result).toEqual('$12.35K');

    const smallResult = formatCentsToReadableValue({
      value: new BigNumber(2.789),
    });

    expect(smallResult).toEqual('$0.02');

    const negativeResult = formatCentsToReadableValue({
      value: new BigNumber(-1235678),
    });

    expect(negativeResult).toEqual('-$12.35K');

    const smallNegativeResult = formatCentsToReadableValue({
      value: new BigNumber(-2.789),
    });

    expect(smallNegativeResult).toEqual('-$0.02');
  });

  it('should format insignificant dollar values correctly', () => {
    const result = formatCentsToReadableValue({
      value: new BigNumber(0.001),
    });
    expect(result).toEqual('< $0.01');

    const negativeResult = formatCentsToReadableValue({
      value: new BigNumber(-0.001),
    });
    expect(negativeResult).toEqual('< $0.01');
  });

  it('should format out-of-bound dollar values correctly', () => {
    const input: FormatCentsToReadableValueInput = {
      value: new BigNumber('1000000000000000000'),
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual('> $100T');

    const negativeInput: FormatCentsToReadableValueInput = {
      value: new BigNumber('-1000000000000000000'),
    };

    const negativeResult = formatCentsToReadableValue(negativeInput);
    expect(negativeResult).toEqual('< -$100T');
  });

  it('should format unshortened correctly', () => {
    const result = formatCentsToReadableValue({
      value: new BigNumber('712142.357623123123'),
      shorten: false,
    });
    expect(result).toEqual('$7,121.42');

    const negativeResult = formatCentsToReadableValue({
      value: new BigNumber('-712142.357623123123'),
      shorten: false,
    });
    expect(negativeResult).toEqual('-$7,121.42');
  });

  it('should format insignificant unshortened values correctly', () => {
    const result = formatCentsToReadableValue({
      value: new BigNumber(0.00000004),
      shorten: false,
    });
    expect(result).toEqual('< $0.000001');
  });

  it('should respect maxDecimalPlaces', () => {
    const dollarResult = formatCentsToReadableValue({
      value: new BigNumber('123.456789'),
      maxDecimalPlaces: 4,
    });
    expect(dollarResult).toEqual('$1.2345');

    const tokenPriceResult = formatCentsToReadableValue({
      value: new BigNumber('12345.6789'),
      shorten: false,
      maxDecimalPlaces: 2,
    });
    expect(tokenPriceResult).toEqual('$123.45');
  });
});
