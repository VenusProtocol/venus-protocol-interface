type ApiCandle = {
  s: number;
  o: string;
  h: string;
  l: string;
  c: string;
};

interface CandleData {
  open: number;
  close: number;
  high: number;
  low: number;
  timestamp: number;
}

export const formatToCandle = ({ o: open, c: close, h: high, l: low, s: timestamp }: ApiCandle) => {
  const candle: CandleData = {
    open: Number(open),
    close: Number(close),
    high: Number(high),
    low: Number(low),
    timestamp,
  };

  return candle;
};
