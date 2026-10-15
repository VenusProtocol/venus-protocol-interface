import { getYAxisTicks } from '..';

const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

describe('getYAxisTicks', () => {
  it('drops ticks that would repeat the label of an earlier one', () => {
    // A week of rates between 1.1065% and 1.1067% rounds to the same label
    const data = [{ apy: 1.1065 }, { apy: 1.1066 }, { apy: 1.1067 }];

    const ticks = getYAxisTicks({
      data,
      tickCount: 6,
      yAxisDataKey: 'apy',
      formatValue: formatPercentage,
    });

    expect(ticks?.map(formatPercentage)).toEqual(['1.11%']);
  });

  it('keeps every tick when the labels are already distinct', () => {
    const data = [{ apy: 0 }, { apy: 5 }];

    const ticks = getYAxisTicks({
      data,
      tickCount: 6,
      yAxisDataKey: 'apy',
      formatValue: formatPercentage,
    });

    expect(ticks).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('returns a single tick when every value is the same', () => {
    const data = [{ apy: 2 }, { apy: 2 }];

    expect(
      getYAxisTicks({ data, tickCount: 6, yAxisDataKey: 'apy', formatValue: formatPercentage }),
    ).toEqual([2]);
  });

  it('returns no ticks without data', () => {
    expect(
      getYAxisTicks({ data: [], tickCount: 6, yAxisDataKey: 'apy', formatValue: formatPercentage }),
    ).toBeUndefined();
  });

  it('ignores data points without a numeric value', () => {
    const data = [{ apy: 0 }, { apy: undefined }, { apy: 4 }];

    const ticks = getYAxisTicks({
      data,
      tickCount: 3,
      yAxisDataKey: 'apy',
      formatValue: formatPercentage,
    });

    expect(ticks).toEqual([0, 2, 4]);
  });
});
