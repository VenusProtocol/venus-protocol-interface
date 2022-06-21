import BigNumber from 'bignumber.js';
import { formatTokensToReadableValue } from 'utilities';

describe('utilities/formatTokensToReadableValue', () => {
  test('formats longhand value correctly', () => {
    const value = formatTokensToReadableValue({
      value: new BigNumber(100000.12333334),
      tokenId: 'busd',
    });
    expect(value).toBe('100,000.12333334 BUSD');
  });

  test('formats shorthand value correctly great than 1', () => {
    const value = formatTokensToReadableValue({
      value: new BigNumber(1000.1234),
      tokenId: 'eth',
      minimizeDecimals: true,
    });
    expect(value).toBe('1,000.12 ETH');
  });

  test('formats shorthand value correctly less than 1', () => {
    const value = formatTokensToReadableValue({
      value: new BigNumber(0.1234),
      tokenId: 'ada',
      minimizeDecimals: true,
    });
    expect(value).toBe('0.1234 ADA');
  });

  test('removes trailing zeros', () => {
    const trailingZeroNumber = new BigNumber(0.0000005);
    const value = formatTokensToReadableValue({
      value: trailingZeroNumber,
      tokenId: 'ada',
      minimizeDecimals: true,
    });
    expect(trailingZeroNumber.toFixed(8)).toBe('0.00000050');
    expect(value).toBe('0.0000005 ADA');
  });
});
