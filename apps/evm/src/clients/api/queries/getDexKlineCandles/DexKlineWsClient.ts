import { WsClient } from 'libs/ws';
import type { DexKlineCandle, DexKlineCandleInterval } from './types';

type CandleCallback = (candle: DexKlineCandle) => void;

interface WsKlineMessage {
  c?: string;
  d?: { u?: number[] };
}

export class DexKlineWsClient extends WsClient {
  private readonly callbacks = new Map<string, Set<CandleCallback>>();

  subscribe(channel: string, callback: CandleCallback): void {
    if (!this.callbacks.has(channel)) {
      this.callbacks.set(channel, new Set());
      this.openChannel(channel);
    }
    this.callbacks.get(channel)!.add(callback);
  }

  unsubscribe(channel: string, callback: CandleCallback): void {
    const set = this.callbacks.get(channel);
    if (!set) return;

    set.delete(callback);

    if (set.size === 0) {
      this.callbacks.delete(channel);
      this.closeChannel(channel);
    }
  }

  protected buildSubscribeMessage(channel: string): string {
    return JSON.stringify({ method: 'SUBSCRIPTION', params: [channel] });
  }

  protected buildUnsubscribeMessage(channel: string): string {
    return JSON.stringify({ method: 'UNSUBSCRIPTION', params: [channel] });
  }

  protected onMessage(data: string): void {
    let msg: WsKlineMessage;

    try {
      msg = JSON.parse(data) as WsKlineMessage;
    } catch {
      return;
    }

    const channel = msg.c;
    const usdOhlcv = msg.d?.u;

    if (!channel || !Array.isArray(usdOhlcv) || usdOhlcv.length < 6) return;

    const [o, h, l, c, v, ts] = usdOhlcv;
    const candle: DexKlineCandle = { open: o, high: h, low: l, close: c, volume: v, timestamp: ts };

    this.callbacks.get(channel)?.forEach(cb => cb(candle));
  }
}

export const buildKlineChannel = (
  platformId: number,
  address: string,
  interval: DexKlineCandleInterval,
) => `datahub@kline@${platformId}@${address}@${interval}`;
