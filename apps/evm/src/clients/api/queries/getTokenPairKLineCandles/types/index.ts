import type { KLineData } from 'klinecharts';
import type { Address } from 'viem';

import type { ApiOhlcInterval } from 'types';

export interface ApiCandle {
  s: number; // start timestamp
  o: string; // open
  h: string; // high
  l: string; // low
  c: string; // close
}

export interface GetTokenPairKLineCandlesApiResponse {
  result: ApiCandle[];
}

export interface GetTokenPairKLineCandlesInput {
  baseTokenAddress: Address;
  quoteTokenAddress: Address;
  startTimeMs: number;
  endTimeMs: number;
  interval?: ApiOhlcInterval;
}

export type GetTokenPairKLineCandlesOutput = KLineData[];
