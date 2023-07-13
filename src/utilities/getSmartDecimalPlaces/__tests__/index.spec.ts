import BigNumber from 'bignumber.js';

import getSmartDecimalPlaces from '..';

describe('getSmartDecimalPlaces', () => {
  it('should return the minimum decimal places when no decimal part in the number', () => {
    const value = new BigNumber('100');
    const result = getSmartDecimalPlaces({ value, minDecimalPlaces: 2 });
    expect(result).toBe(2);
  });

  it('should return the correct decimal places when decimal part in the number', () => {
    const value = new BigNumber('100.1234');
    const result = getSmartDecimalPlaces({ value });
    expect(result).toBe(2);
  });

  it('should limit the decimal places to maxDecimalPlaces when provided', () => {
    const value = new BigNumber('100.00004123');
    const result = getSmartDecimalPlaces({ value, maxDecimalPlaces: 5 });
    expect(result).toBe(5);
  });

  it('should return the minDecimalPlaces when decimal places less than minDecimalPlaces', () => {
    const value = new BigNumber('100.01');
    const result = getSmartDecimalPlaces({ value, minDecimalPlaces: 3 });
    expect(result).toBe(3);
  });

  it('should consider next non-zero decimal if it exists', () => {
    const value = new BigNumber('100.011');
    const result = getSmartDecimalPlaces({ value });
    expect(result).toBe(3);
  });

  it('should not consider next non-zero decimal if it does not exist', () => {
    const value = new BigNumber('100.010');
    const result = getSmartDecimalPlaces({ value });
    expect(result).toBe(2);
  });

  it('should work with zero and return minDecimalPlaces', () => {
    const value = new BigNumber('0');
    const result = getSmartDecimalPlaces({ value, minDecimalPlaces: 2 });
    expect(result).toBe(2);
  });
});
