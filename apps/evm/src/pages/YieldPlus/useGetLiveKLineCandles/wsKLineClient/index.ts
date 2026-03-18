import config from 'config';
import { KLineCandleWsClient } from './KLineCandleWsClient';

export * from './types';

export const wsKLineClient = new KLineCandleWsClient(`${config.wsApiUrl}/ohlc`);
