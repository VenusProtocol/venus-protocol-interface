export type DexKlineCandleInterval =
  | '1s'
  | '1min'
  | '3min'
  | '5min'
  | '15min'
  | '30min'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1m';

export interface GetDexKlineCandlesInput {
  platform: string;
  address: string;
  interval: DexKlineCandleInterval;
  limit: number;
  from?: number;
  to?: number;
  unit?: 'usd' | 'native' | 'quote';
  tokenIndex?: 0 | 1;
}

export type ApiDexKlineCandle = [
  number, // o - open price
  number, // h - highest price
  number, // l - lowest price
  number, // c - close price
  number, // v - volume
  number, // ts - opening time (Unix ms)
];

export interface GetApiDexKlineCandlesOutput {
  data: ApiDexKlineCandle[];
  status: {
    timestamp: string;
    error_code: string;
    error_message: string;
    elapsed: string;
    credit_count: number;
  };
}

export interface DexKlineCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  [key: string]: unknown;
}

export interface GetDexKlineCandlesOutput {
  candles: DexKlineCandle[];
}
