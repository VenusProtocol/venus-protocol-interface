import { getXAxisTicks } from '..';

const data = [
  { blockTimestampMs: 1 },
  { blockTimestampMs: 2 },
  { blockTimestampMs: 3 },
  { blockTimestampMs: 4 },
  { blockTimestampMs: 5 },
];

describe('getXAxisTicks', () => {
  it('returns undefined when no interval is passed', () => {
    expect(getXAxisTicks({ data, xAxisDataKey: 'blockTimestampMs' })).toBeUndefined();
  });

  it('returns evenly spread ticks', () => {
    expect(getXAxisTicks({ data, interval: 3, xAxisDataKey: 'blockTimestampMs' })).toEqual([
      1, 3, 5,
    ]);
  });

  it('skips missing data points instead of throwing', () => {
    const dataWithHole = [...data.slice(0, 4), undefined] as typeof data;

    expect(
      getXAxisTicks({ data: dataWithHole, interval: 5, xAxisDataKey: 'blockTimestampMs' }),
    ).toEqual([1, 2, 3, 4]);
  });
});
