import BigNumber from 'bignumber.js';
import { formatCoinsToReadableValue } from './common';

describe('utilities/formatCoinsToReadableValue', () => {
  test('formats longhand value correctly', () => {
    const value = formatCoinsToReadableValue({
      value: new BigNumber(100000.12333334),
      tokenId: 'busd',
    });
    expect(value).toBe('100,000.12333334 BUSD');
  });

  test('formats shorthand value correctly great than 1', () => {
    const value = formatCoinsToReadableValue({
      value: new BigNumber(1000.1234),
      tokenId: 'eth',
      shorthand: true,
    });
    expect(value).toBe('1,000.12 ETH');
  });

  test('formats shorthand value correctly less than 1', () => {
    const value = formatCoinsToReadableValue({
      value: new BigNumber(0.1234),
      tokenId: 'ada',
      shorthand: true,
    });
    expect(value).toBe('0.1234 ADA');
  });
});
