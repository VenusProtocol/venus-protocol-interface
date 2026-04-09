import type { Address } from 'viem';

import { INTERVAL } from 'constants/klineCandles';
import { logError } from 'libs/errors';
import { WsClient } from 'libs/webSocket';
import type { ApiOhlcInterval, Token } from 'types';
import type { WsKLineMessage } from '../types';
import { getChannelId } from './getChannelId';

interface ApiWsSubMessage {
  type: 'subscribe' | 'unsubscribe';
  id: string;
  baseTokenAddress: Address;
  quoteTokenAddress: Address;
  interval: ApiOhlcInterval;
}

export type CandleCallback = (candle: WsKLineMessage) => void;

export class KLineCandleWsClient extends WsClient {
  private readonly callbacks = new Map<string, Set<CandleCallback>>();

  subscribe({
    baseToken,
    quoteToken,
    onMessage,
  }: {
    baseToken: Token;
    quoteToken: Token;
    onMessage: CandleCallback;
  }): void {
    const channelId = getChannelId({
      baseToken,
      quoteToken,
    });

    if (!this.callbacks.has(channelId)) {
      this.callbacks.set(channelId, new Set());

      const subscribeMessage = JSON.stringify({
        type: 'subscribe',
        id: channelId,
        baseTokenAddress: baseToken.address,
        quoteTokenAddress: quoteToken.address,
        interval: INTERVAL,
      } satisfies ApiWsSubMessage);

      this.openChannel({
        channelId,
        subscribeMessage,
      });
    }

    this.callbacks.get(channelId)?.add(onMessage);
  }

  unsubscribe({
    baseToken,
    quoteToken,
    onMessage,
  }: {
    baseToken: Token;
    quoteToken: Token;
    onMessage: CandleCallback;
  }): void {
    const channelId = getChannelId({
      baseToken,
      quoteToken,
    });

    const set = this.callbacks.get(channelId);

    if (!set) return;

    set.delete(onMessage);

    if (set.size === 0) {
      const unsubscribeMessage = JSON.stringify({
        type: 'unsubscribe',
        id: channelId,
        baseTokenAddress: baseToken.address,
        quoteTokenAddress: quoteToken.address,
        interval: INTERVAL,
      } satisfies ApiWsSubMessage);

      this.callbacks.delete(channelId);
      this.closeChannel({ channelId, unsubscribeMessage });
    }
  }

  protected onMessage(msg: string): void {
    let data: WsKLineMessage;

    try {
      data = JSON.parse(msg) as WsKLineMessage;
    } catch {
      return;
    }

    if (data.type === 'error') {
      logError(data.message);
      return;
    }

    this.callbacks.get(data.id)?.forEach(cb => cb(data));
  }
}
