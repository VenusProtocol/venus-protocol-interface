import { getRoundedYAxisTicks } from '..';

describe('getRoundedYAxisTicks', () => {
  it('returns five rounded ticks around the values', () => {
    expect(getRoundedYAxisTicks([10_000_000, 13_000_000])).toEqual([
      9_000_000, 10_000_000, 11_000_000, 12_000_000, 13_000_000,
    ]);
  });

  it.each([
    [399_000, 413_000],
    [0, 0],
    [100, 100],
    [-25_000, -18_000],
    [-12_000, 8_000],
    [0.01, 0.04],
  ])('covers every value with increasing ticks: %j', (minimum, maximum) => {
    const ticks = getRoundedYAxisTicks([minimum, maximum]) ?? [];

    expect(ticks).toHaveLength(5);
    expect(ticks[0]).toBeLessThanOrEqual(minimum);
    expect(ticks[4]).toBeGreaterThanOrEqual(maximum);
    expect(ticks.every((tick, index) => index === 0 || tick > ticks[index - 1])).toBe(true);
  });

  it('does not go below zero when every value is positive', () => {
    const ticks = getRoundedYAxisTicks([150_000, 600_000]) ?? [];

    expect(ticks[0]).toBe(0);
    expect(ticks[4]).toBeGreaterThanOrEqual(600_000);
  });

  it('widens the step until every formatted label is distinct', () => {
    const formatValue = (value: number) => `$${(value / 100_000_000).toFixed(2)}M`;
    const ticks = getRoundedYAxisTicks([210_000_000, 210_020_000], formatValue) ?? [];

    expect(new Set(ticks.map(formatValue)).size).toBe(ticks.length);
    expect(ticks[0]).toBeLessThanOrEqual(210_000_000);
    expect(ticks[4]).toBeGreaterThanOrEqual(210_020_000);
  });

  it('ignores non-finite values', () => {
    expect(getRoundedYAxisTicks([])).toBeUndefined();
    expect(getRoundedYAxisTicks([Number.NaN, Number.POSITIVE_INFINITY])).toBeUndefined();
    expect(getRoundedYAxisTicks([399_000, Number.NaN, 413_000])).toEqual(
      getRoundedYAxisTicks([399_000, 413_000]),
    );
  });
});
