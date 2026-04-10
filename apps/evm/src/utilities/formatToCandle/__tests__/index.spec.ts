import { formatToCandle } from '..';

type ApiCandle = Parameters<typeof formatToCandle>[0];

describe('formatToCandle', () => {
  it('maps API candle fields to a KLine candle', () => {
    const apiCandle: ApiCandle = {
      s: 1743494400000,
      o: '12.34',
      h: '15.67',
      l: '11.22',
      c: '14.56',
    };

    const result = formatToCandle(apiCandle);

    expect(result).toEqual({
      timestamp: 1743494400000,
      open: 12.34,
      high: 15.67,
      low: 11.22,
      close: 14.56,
    });
  });

  it('converts integer and zero string values to numbers without changing timestamp', () => {
    const apiCandle: ApiCandle = {
      s: 0,
      o: '0',
      h: '10',
      l: '0',
      c: '8',
    };

    const result = formatToCandle(apiCandle);

    expect(result.open).toBe(0);
    expect(result.high).toBe(10);
    expect(result.low).toBe(0);
    expect(result.close).toBe(8);
    expect(result.timestamp).toBe(0);
  });
});
