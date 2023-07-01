import BigNumber from 'bignumber.js';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import formatCentsToReadableValue, { FormatCentsToReadableValueInput } from '..';

describe('utilities/formatCentsToReadableValue', () => {
  test('should return PLACEHOLDER_KEY when value is undefined', () => {
    const input: FormatCentsToReadableValueInput = {
      value: undefined,
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual(PLACEHOLDER_KEY);
  });

  test('should return 0 values correctly', () => {
    const result = formatCentsToReadableValue({
      value: 0,
    });
    expect(result).toEqual('$0');

    const negativeResult = formatCentsToReadableValue({
      isTokenPrice: true,
      value: 0,
    });
    expect(negativeResult).toEqual('$0');
  });

  test('should format dollar values correctly', () => {
    const result = formatCentsToReadableValue({
      value: new BigNumber(1235678),
    });

    expect(result).toEqual('$12.35K');

    const negativeResult = formatCentsToReadableValue({
      value: new BigNumber(-1235678),
    });

    expect(negativeResult).toEqual('-$12.35K');
  });

  test('should format insignificant dollar values correctly', () => {
    const result = formatCentsToReadableValue({
      value: new BigNumber(0.001),
    });
    expect(result).toEqual('< $0.01');

    const negativeResult = formatCentsToReadableValue({
      value: new BigNumber(-0.001),
    });
    expect(negativeResult).toEqual('< $0.01');
  });

  test('should format out-of-bound dollar values correctly', () => {
    const input: FormatCentsToReadableValueInput = {
      value: new BigNumber('1000000000000000000'),
    };

    const result = formatCentsToReadableValue(input);
    expect(result).toEqual('> $100.00B');

    const negativeInput: FormatCentsToReadableValueInput = {
      value: new BigNumber('-1000000000000000000'),
    };

    const negativeResult = formatCentsToReadableValue(negativeInput);
    expect(negativeResult).toEqual('< -$100.00B');
  });

  test('should format token prices correctly', () => {
    const result = formatCentsToReadableValue({
      value: new BigNumber('712142.357623123123'),
      isTokenPrice: true,
    });
    expect(result).toEqual('$7,121.423576');

    const negativeResult = formatCentsToReadableValue({
      value: new BigNumber('-712142.357623123123'),
      isTokenPrice: true,
    });
    expect(negativeResult).toEqual('-$7,121.423576');
  });

  test('should format insignificant token prices correctly', () => {
    const result = formatCentsToReadableValue({
      value: new BigNumber(0.00000004),
    });
    expect(result).toEqual('< $0.01');
  });
});
