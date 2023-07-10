import BigNumber from 'bignumber.js';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';

import formatTokensToReadableValue, { FormatTokensToReadableValueInput } from '..';

describe('utilities/formatTokensToReadableValue', () => {
  test('should return PLACEHOLDER_KEY when value is undefined', () => {
    const result = formatTokensToReadableValue({
      value: undefined,
      token: TOKENS.busd,
      addSymbol: false,
    });
    expect(result).toEqual(PLACEHOLDER_KEY);
  });

  test('should return 0 values correctly', () => {
    const result = formatTokensToReadableValue({
      value: new BigNumber(0),
      token: TOKENS.busd,
    });
    expect(result).toEqual('0 BUSD');
  });

  test('should format insignificant values correctly', () => {
    const input: FormatTokensToReadableValueInput = {
      value: new BigNumber(0.0000001),
      token: TOKENS.busd,
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
      token: TOKENS.busd,
    });
    expect(result).toEqual('> 100.00B BUSD');

    const negativeResult = formatTokensToReadableValue({
      value: new BigNumber('-1000000000000000000'),
      token: TOKENS.busd,
    });
    expect(negativeResult).toEqual('< -100.00B BUSD');
  });

  test('should return a formatted value with token symbol when addSymbol is true', () => {
    const input: FormatTokensToReadableValueInput = {
      value: new BigNumber(1234.5678),
      token: TOKENS.busd,
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
});
