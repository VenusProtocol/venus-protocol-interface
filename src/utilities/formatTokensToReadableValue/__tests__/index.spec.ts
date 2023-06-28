import BigNumber from 'bignumber.js';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';

import formatTokensToReadableValue, { FormatTokensToReadableValueInput } from '..';
import shortenValueWithSuffix, { ShortenValueWithSuffix } from '../../shortenValueWithSuffix';

vi.mock('../../shortenValueWithSuffix', () => ({
  default: vi.fn(({ value }: ShortenValueWithSuffix) => value.toFixed()),
}));

describe('utilities/formatTokensToReadableValue', () => {
  test('should return PLACEHOLDER_KEY when value is undefined', () => {
    const input: FormatTokensToReadableValueInput = {
      value: undefined,
      token: TOKENS.busd,
      addSymbol: false,
    };

    const result = formatTokensToReadableValue(input);
    expect(result).toEqual(PLACEHOLDER_KEY);
  });

  test('should return 0 values correctly', () => {
    const input: FormatTokensToReadableValueInput = {
      value: new BigNumber(0),
      token: TOKENS.busd,
    };

    const result = formatTokensToReadableValue(input);
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
    const input: FormatTokensToReadableValueInput = {
      value: new BigNumber('1000000000000000000'),
      token: TOKENS.busd,
    };

    const result = formatTokensToReadableValue(input);
    expect(result).toEqual('> 100000000000 BUSD');
  });

  test('should return a formatted value with token symbol when addSymbol is true', () => {
    const value = new BigNumber(1234.5678);
    const input: FormatTokensToReadableValueInput = {
      value,
      token: TOKENS.busd,
      addSymbol: true,
    };

    const result = formatTokensToReadableValue(input);

    expect(shortenValueWithSuffix).toHaveBeenCalledTimes(1);
    expect(shortenValueWithSuffix).toHaveBeenCalledWith({
      value,
      maxDecimalPlaces: TOKENS.busd.decimals,
    });

    expect(result).toEqual('1234.5678 BUSD');
  });
});
