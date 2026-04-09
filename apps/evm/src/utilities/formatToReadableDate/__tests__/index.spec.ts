import { formatToReadableDate } from '../index';

describe('utilities/formatToReadableDate', () => {
  it('should use the short date translation key when selected period is year', () => {
    const t = vi.fn().mockReturnValue('formatted date');

    const result = formatToReadableDate({
      timestampMs: 1711843200000,
      selectedPeriod: 'year',
      t,
    });

    expect(result).toBe('formatted date');
    expect(t).toHaveBeenCalledWith('apyChart.date.short', {
      date: new Date(1711843200000),
    });
  });

  it('should use the full date translation key when selected period is not year', () => {
    const t = vi.fn().mockReturnValue('formatted date');

    const result = formatToReadableDate({
      timestampMs: 1711843200000,
      selectedPeriod: 'month',
      t,
    });

    expect(result).toBe('formatted date');
    expect(t).toHaveBeenCalledWith('apyChart.date.full', {
      date: new Date(1711843200000),
    });
  });
});
