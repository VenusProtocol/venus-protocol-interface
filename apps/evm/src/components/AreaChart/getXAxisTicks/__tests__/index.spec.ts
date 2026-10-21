import { getXAxisTicks } from '..';

describe('getXAxisTicks', () => {
  it('drops ticks that would repeat the label of an earlier one', () => {
    const data = [{ t: 1 }, { t: 2 }, { t: 3 }, { t: 4 }, { t: 5 }];
    const formatValue = (t: number) => `day-${Math.ceil(t / 2)}`;

    const ticks = getXAxisTicks({ data, interval: 5, xAxisDataKey: 't', formatValue });

    expect(ticks?.map(formatValue)).toEqual(['day-1', 'day-2', 'day-3']);
    expect(new Set(ticks?.map(formatValue)).size).toBe(ticks?.length);
  });

  it('keeps every tick when the labels are already distinct', () => {
    const data = [{ t: 1 }, { t: 2 }, { t: 3 }];
    const formatValue = (t: number) => `day-${t}`;

    expect(getXAxisTicks({ data, interval: 3, xAxisDataKey: 't', formatValue })).toEqual([1, 2, 3]);
  });

  it('leaves ticks untouched when no formatter is passed', () => {
    const data = [{ t: 1 }, { t: 2 }, { t: 3 }];

    expect(getXAxisTicks({ data, interval: 3, xAxisDataKey: 't' })).toEqual([1, 2, 3]);
  });

  it('returns no ticks when there is no interval', () => {
    expect(getXAxisTicks({ data: [{ t: 1 }], xAxisDataKey: 't' })).toBeUndefined();
  });
});
