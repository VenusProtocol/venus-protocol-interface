import BigNumber from 'bignumber.js';

import { busd } from '__mocks__/models/tokens';

import PLACEHOLDER_KEY from 'constants/placeholderKey';

import formatTokensToReadableValue, { type FormatTokensToReadableValueInput } from '..';

describe('formatTokensToReadableValue', () => {
  test('should return placeholder when value is undefined', () => {
    const result = formatTokensToReadableValue({
      value: undefined,
      token: busd,
      addSymbol: false,
    });
    expect(result).toEqual(PLACEHOLDER_KEY);
  });

  test('should return placeholder when token is undefined', () => {
    const result = formatTokensToReadableValue({
      value: new BigNumber(1000),
      token: undefined,
      addSymbol: false,
    });
    expect(result).toEqual(PLACEHOLDER_KEY);
  });

  test('should return 0 values correctly', () => {
    const result = formatTokensToReadableValue({
      value: new BigNumber(0),
      token: busd,
    });
    expect(result).toEqual('0 BUSD');
  });

  test('should format insignificant values correctly', () => {
    const input: FormatTokensToReadableValueInput = {
      value: new BigNumber(0.0000001),
      token: busd,
      addSymbol: false,
    };

    const result = formatTokensToReadableValue(input);
    expect(result).toEqual('< 0.000001');

    const negativeResult = formatTokensToReadableValue({
      ...input,
      value: new BigNumber(-0.0000001),
    });
    expect(negativeResult).toEqual('< 0.000001');
  });

  test('should format out-of-bound values correctly', () => {
    const result = formatTokensToReadableValue({
      value: new BigNumber('1000000000000000000'),
      token: busd,
    });
    expect(result).toEqual('> 100T BUSD');

    const negativeResult = formatTokensToReadableValue({
      value: new BigNumber('-1000000000000000000'),
      token: busd,
    });
    expect(negativeResult).toEqual('< -100T BUSD');
  });

  test('should return a formatted value with token symbol when addSymbol is true', () => {
    const input: FormatTokensToReadableValueInput = {
      value: new BigNumber(1234.5678),
      token: busd,
      addSymbol: true,
    };

    const result = formatTokensToReadableValue(input);
    expect(result).toEqual('1.23K BUSD');

    const negativeResult = formatTokensToReadableValue({
      ...input,
      value: new BigNumber(-1234.5678),
    });
    expect(negativeResult).toEqual('-1.23K BUSD');
  });

  test('should return a formatted value rounded using the passed rounding mode', () => {
    const input: FormatTokensToReadableValueInput = {
      value: new BigNumber(12.5678),
      token: busd,
      roundingMode: BigNumber.ROUND_DOWN,
    };

    const result = formatTokensToReadableValue(input);
    expect(result).toEqual('12.5678 BUSD');

    const negativeResult = formatTokensToReadableValue({
      ...input,
      value: new BigNumber(-12.5678),
    });
    expect(negativeResult).toEqual('-12.5678 BUSD');
  });
});
