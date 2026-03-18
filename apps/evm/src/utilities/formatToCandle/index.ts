import type { KLineData } from 'klinecharts';

import type { ApiCandle } from 'clients/api';

export const formatToCandle = ({ o: open, c: close, h: high, l: low, s: timestamp }: ApiCandle) => {
  const candle: KLineData = {
    open: Number(open),
    close: Number(close),
    high: Number(high),
    low: Number(low),
    timestamp,
  };

  return candle;
};
