import type { Address } from 'viem';

import type { ApiCandle } from 'clients/api';

interface BaseWsKLineMessage {
  id: string;
}

export interface WsKLineErrorMessage extends BaseWsKLineMessage {
  type: 'error';
  message: string;
}

export interface WsKLineSubscribedMessage extends BaseWsKLineMessage {
  type: 'subscribed';
  pair: {
    baseTokenAddress: Address;
    quoteTokenAddress: Address;
  };
}

export interface WsKLineHistoryMessage extends BaseWsKLineMessage {
  type: 'history';
  data: ApiCandle[];
}

export interface WsKLineOhlcMessage extends BaseWsKLineMessage {
  type: 'ohlc';
  data: ApiCandle;
}

export type WsKLineMessage =
  | WsKLineErrorMessage
  | WsKLineSubscribedMessage
  | WsKLineHistoryMessage
  | WsKLineOhlcMessage;
