import BigNumber from 'bignumber.js';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import formatCentsToReadableValue, { FormatCentsToReadableValueInput } from '..';
import shortenValueWithSuffix, { ShortenValueWithSuffix } from '../../shortenValueWithSuffix';

jest.mock('../../shortenValueWithSuffix', () =>
  jest.fn(({ value }: ShortenValueWithSuffix) => value.toFixed()),
);

describe('utilities/formatCentsToReadableValue', () => {
  test('should return PLACEHOLDER_KEY when value is undefined', () => {
    const input: FormatCentsToReadableValueInput = {
      value: undefined,
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual(PLACEHOLDER_KEY);
  });

  test('should return 0 values correctly', () => {
    const input: FormatCentsToReadableValueInput = {
      value: 0,
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual('$0');

    const negativeResult = formatCentsToReadableValue({
      ...input,
      isTokenPrice: true,
    });
    expect(negativeResult).toEqual('$0');
  });

  test('should format token prices correctly', () => {
    const input: FormatCentsToReadableValueInput = {
      value: 712.357623123123,
      isTokenPrice: true,
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual('$7.123576');
  });

  test('should format insignificant token prices correctly', () => {
    const value = new BigNumber(0.00000004);
    const input: FormatCentsToReadableValueInput = {
      value,
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual('< $0.01');
  });

  test('should format dollar values correctly', () => {
    const value = new BigNumber(1234.5678);
    const input: FormatCentsToReadableValueInput = {
      value,
    };

    const result = formatCentsToReadableValue(input);

    expect(shortenValueWithSuffix).toHaveBeenCalledTimes(1);
    expect(shortenValueWithSuffix).toHaveBeenCalledWith({
      value: value.dividedBy(100),
      maxDecimalPlaces: 2,
    });

    expect(result).toEqual('$12.345678');
  });

  test('should format insignificant dollar values correctly', () => {
    const input: FormatCentsToReadableValueInput = {
      value: new BigNumber(0.001),
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual('< $0.01');

    const negativeResult = formatCentsToReadableValue({
      ...input,
      value: new BigNumber(-0.001),
    });
    expect(negativeResult).toEqual('< $0.01');
  });

  test('should format out-of-bound dollar values correctly', () => {
    const input: FormatCentsToReadableValueInput = {
      value: new BigNumber('1000000000000000000'),
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual('> $100000000000');
  });

  test('should format negative values correctly', () => {
    const value = new BigNumber(-1234.5678);
    const input: FormatCentsToReadableValueInput = {
      value,
    };

    const result = formatCentsToReadableValue(input);

    expect(shortenValueWithSuffix).toHaveBeenCalledTimes(1);
    expect(shortenValueWithSuffix).toHaveBeenCalledWith({
      value: value.dividedBy(100),
      maxDecimalPlaces: 2,
    });

    expect(result).toEqual('-$12.345678');
  });
});
