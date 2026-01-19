import BigNumber from 'bignumber.js';

import { PLACEHOLDER_KEY } from 'constants/placeholders';

import formatPercentageToReadableValue from '..';

describe('utilities/formatPercentageToReadableValue', () => {
  it('should return PLACEHOLDER_KEY when value is undefined', () => {
    const result = formatPercentageToReadableValue(undefined);
    expect(result).toBe(PLACEHOLDER_KEY);
  });

  it('should return "0%" when value is 0', () => {
    const result = formatPercentageToReadableValue(0);
    expect(result).toBe('0%');
  });

  it('should return "> 10000" when value is greater than 10000', () => {
    const result = formatPercentageToReadableValue(10001);
    expect(result).toBe('> 10,000%');
  });

  it('should return "< -10000" when value is less than -10000', () => {
    const result = formatPercentageToReadableValue(-10001);
    expect(result).toBe('< -10,000%');
  });

  it('should return "< 0.01" when value is less than 0.01', () => {
    const result = formatPercentageToReadableValue(0.009);
    expect(result).toBe('< 0.01%');
  });

  it('should return "-1.00%" when value is -1', () => {
    const result = formatPercentageToReadableValue(-1);
    expect(result).toBe('-1%');
  });

  it('should handle a positive BigNumber instance', () => {
    const value = new BigNumber(50);
    const result = formatPercentageToReadableValue(value);
    expect(result).toBe('50%');
  });

  it('should handle a negative BigNumber instance', () => {
    const value = new BigNumber(-50);
    const result = formatPercentageToReadableValue(value);
    expect(result).toBe('-50%');
  });

  it('should handle a string number', () => {
    const value = '200.567';
    const result = formatPercentageToReadableValue(value);
    expect(result).toBe('200.56%');
  });
});
