import BigNumber from 'bignumber.js';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { TOKENS } from 'constants/tokens';

import formatTokensToReadableValue, { FormatTokensToReadableValueInput } from '..';
import shortenValueWithSuffix, { ShortenValueWithSuffix } from '../../shortenValueWithSuffix';

jest.mock('../../shortenValueWithSuffix', () =>
  jest.fn(({ value }: ShortenValueWithSuffix) => value.toFixed()),
);

describe('utilities/formatTokensToReadableValue', () => {
  test('should return placeholder key when value is undefined', () => {
    const input: FormatTokensToReadableValueInput = {
      value: undefined,
      token: TOKENS.busd,
      addSymbol: false,
    };

    const result = formatTokensToReadableValue(input);
    expect(result).toEqual(PLACEHOLDER_KEY);
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
    });

    expect(result).toEqual('1234.5678 BUSD');
  });
});
