import BigNumber from 'bignumber.js';
import { formatTokensToReadableValue } from 'utilities';

import TEST_TOKENS from '__mocks__/models/tokens';

describe('utilities/formatTokensToReadableValue', () => {
  test('formats longhand value correctly', () => {
    const value = formatTokensToReadableValue({
      value: new BigNumber(100000.12333334),
      token: TEST_TOKENS.xvs,
    });
    expect(value).toBe('100,000.12333334 BUSD');
  });

  test('formats shorthand value correctly', () => {
    const value = formatTokensToReadableValue({
      value: new BigNumber(0.1234567899999),
      token: TEST_TOKENS.xvs,
      minimizeDecimals: true,
    });
    expect(value).toBe('0.12345679 ADA');
  });

  test('removes trailing zeros', () => {
    const trailingZeroNumber = new BigNumber(0.0000005);
    const value = formatTokensToReadableValue({
      value: trailingZeroNumber,
      token: TEST_TOKENS.xvs,
      minimizeDecimals: true,
    });
    expect(trailingZeroNumber.toFixed(8)).toBe('0.00000050');
    expect(value).toBe('0.0000005 ADA');
  });
});
