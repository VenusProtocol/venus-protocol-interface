import { convertDecimalToPercentage } from '..';

describe('convertDecimalToPercentage', () => {
  it('converts a decimal fraction to its percentage representation', () => {
    expect(convertDecimalToPercentage(0.05)).toBe(5);
  });

  it('handles zero', () => {
    expect(convertDecimalToPercentage(0)).toBe(0);
  });

  it('handles values above one', () => {
    expect(convertDecimalToPercentage(1.5)).toBe(150);
  });

  it('handles negative fractions', () => {
    expect(convertDecimalToPercentage(-0.025)).toBe(-2.5);
  });
});
