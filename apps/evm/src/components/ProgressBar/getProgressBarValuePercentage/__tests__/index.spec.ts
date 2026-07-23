import { getProgressBarValuePercentage } from '..';

describe('getProgressBarValuePercentage', () => {
  it('returns the value percentage of the range', () => {
    expect(getProgressBarValuePercentage({ value: 30, min: 10, max: 50 })).toBe(50);
  });

  it('does not clamp values to the range', () => {
    expect(getProgressBarValuePercentage({ value: -10, min: 0, max: 100 })).toBe(-10);
    expect(getProgressBarValuePercentage({ value: 150, min: 0, max: 100 })).toBe(150);
  });

  it('returns zero percent for an invalid range', () => {
    expect(getProgressBarValuePercentage({ value: 75, min: 50, max: 50 })).toBe(0);
  });
});
