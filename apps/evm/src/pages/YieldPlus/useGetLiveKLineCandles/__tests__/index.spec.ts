import { act } from '@testing-library/react';
import type { DataLoaderGetBarsParams, DataLoaderSubscribeBarParams, KLineData } from 'klinecharts';

import { usdc, usdt, wbnb } from '__mocks__/models/tokens';
import type { ApiCandle } from 'clients/api';
import { getTokenPairKLineCandles } from 'clients/api';
import { renderHook } from 'testUtils/render';
import { ApiOhlcInterval, type Token } from 'types';
import type { Mock } from 'vitest';
import { useGetLiveKLineCandles } from '..';
import { wsKLineClient } from '../wsKLineClient';

vi.mock('clients/api', () => ({
  getTokenPairKLineCandles: vi.fn(),
}));

vi.mock('libs/errors', () => ({
  logError: vi.fn(),
}));

vi.mock('../wsKLineClient', () => ({
  wsKLineClient: {
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  },
}));

const fakeRangeMs = 60_000;
const fakeBarsTimestamp = 1700000000000;
const fakeInterval = ApiOhlcInterval['1h'];
const fakeSymbol = {
  ticker: 'WBNB/USDC',
  pricePrecision: 2,
  volumePrecision: 2,
};
const fakePeriod = {
  type: 'minute',
  span: 1,
} as const;

const makeCandle = ({
  timestamp,
  open = 0,
  high = 0,
  low = 0,
  close,
}: {
  timestamp: number;
  open?: number;
  high?: number;
  low?: number;
  close: number;
}): KLineData => ({
  timestamp,
  open,
  high,
  low,
  close,
});

const makeApiCandle = ({
  timestamp,
  open,
  high,
  low,
  close,
}: {
  timestamp: number;
  open?: number;
  high?: number;
  low?: number;
  close: number;
}): ApiCandle => {
  const candle = makeCandle({
    timestamp,
    open,
    high,
    low,
    close,
  });

  return {
    s: candle.timestamp,
    o: String(candle.open),
    h: String(candle.high),
    l: String(candle.low),
    c: String(candle.close),
  };
};

const makeOhlcMessage = ({
  timestamp,
  open,
  high,
  low,
  close,
}: {
  timestamp: number;
  open?: number;
  high?: number;
  low?: number;
  close: number;
}) => ({
  id: 'test-channel',
  type: 'ohlc' as const,
  data: makeApiCandle({
    timestamp,
    open,
    high,
    low,
    close,
  }),
});

const makeNonOhlcMessage = () => ({
  id: 'test-channel',
  type: 'subscribed' as const,
  pair: {
    baseTokenAddress: wbnb.address,
    quoteTokenAddress: usdc.address,
  },
});

const createDeferred = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((nextResolve, nextReject) => {
    resolve = nextResolve;
    reject = nextReject;
  });

  return {
    promise,
    resolve,
    reject,
  };
};

const serializeHookState = ({
  changePercentage,
  priceCentsRatio,
}: ReturnType<typeof useGetLiveKLineCandles>) => ({
  changePercentage,
  priceCentsRatio: priceCentsRatio?.toFixed(),
});

const buildGetBarsParams = ({
  callback = vi.fn(),
  timestamp = fakeBarsTimestamp,
  type = 'init',
}: Partial<DataLoaderGetBarsParams> = {}): DataLoaderGetBarsParams => ({
  callback,
  timestamp,
  type,
  symbol: fakeSymbol,
  period: fakePeriod,
});

const buildSubscribeBarParams = ({
  callback = vi.fn(),
}: Partial<DataLoaderSubscribeBarParams> = {}): DataLoaderSubscribeBarParams => ({
  callback,
  symbol: fakeSymbol,
  period: fakePeriod,
});

describe('useGetLiveKLineCandles', () => {
  let baseToken: Token;
  let quoteToken: Token;

  beforeEach(() => {
    vi.clearAllMocks();

    baseToken = wbnb;
    quoteToken = usdc;
  });

  it('returns an empty result for backward loads without fetching candles', async () => {
    const { result } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );
    const callback = vi.fn();

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          callback,
          type: 'backward',
        }),
      );
    });

    expect(callback).toHaveBeenCalledWith([], {
      backward: false,
      forward: false,
    });
    expect(getTokenPairKLineCandles).not.toHaveBeenCalled();
  });

  it('loads and sorts historical candles on init and snapshots the returned state', async () => {
    (getTokenPairKLineCandles as Mock).mockResolvedValue([
      makeCandle({
        timestamp: 2000,
        open: 8,
        high: 10,
        low: 7,
        close: 10,
      }),
      makeCandle({
        timestamp: 1000,
        open: 6,
        high: 8,
        low: 5,
        close: 8,
      }),
    ]);

    const { result } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );
    const callback = vi.fn();

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          callback,
          timestamp: fakeBarsTimestamp,
          type: 'init',
        }),
      );
    });

    expect(getTokenPairKLineCandles).toHaveBeenCalledWith({
      baseTokenAddress: baseToken.address,
      quoteTokenAddress: quoteToken.address,
      startTimeMs: fakeBarsTimestamp - fakeRangeMs,
      endTimeMs: fakeBarsTimestamp,
      interval: fakeInterval,
    });
    expect(callback.mock.calls).toMatchSnapshot();
    expect(serializeHookState(result.current)).toMatchSnapshot();
  });

  it('returns candles for non-init loads without overwriting the historical baseline', async () => {
    (getTokenPairKLineCandles as Mock)
      .mockResolvedValueOnce([
        makeCandle({
          timestamp: 1000,
          close: 8,
        }),
        makeCandle({
          timestamp: 2000,
          close: 10,
        }),
      ])
      .mockResolvedValueOnce([
        makeCandle({
          timestamp: 4000,
          close: 40,
        }),
        makeCandle({
          timestamp: 3000,
          close: 30,
        }),
      ]);

    const { result } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          type: 'init',
        }),
      );
    });

    const stateBeforeUpdate = serializeHookState(result.current);
    const callback = vi.fn();

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          callback,
          type: 'update',
          timestamp: fakeBarsTimestamp + fakeRangeMs,
        }),
      );
    });

    expect(callback.mock.calls).toMatchSnapshot();
    expect({
      before: stateBeforeUpdate,
      after: serializeHookState(result.current),
    }).toMatchSnapshot();
  });

  it('logs errors and returns an empty result for active failed requests', async () => {
    const error = new Error('failed to fetch candles');
    (getTokenPairKLineCandles as Mock).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );
    const callback = vi.fn();

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          callback,
          type: 'init',
        }),
      );
    });

    expect(callback.mock.calls).toMatchSnapshot();
    expect(serializeHookState(result.current)).toMatchSnapshot();
  });

  it('ignores stale historical success responses after the source changes', async () => {
    const deferred = createDeferred<KLineData[]>();
    (getTokenPairKLineCandles as Mock).mockReturnValue(deferred.promise);

    const { result, rerender } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );
    const callback = vi.fn();

    const getBarsPromise = result.current.dataLoader.getBars(
      buildGetBarsParams({
        callback,
        type: 'init',
      }),
    );

    quoteToken = usdt;

    act(() => {
      rerender();
    });

    await act(async () => {
      deferred.resolve([
        makeCandle({
          timestamp: 1000,
          close: 8,
        }),
        makeCandle({
          timestamp: 2000,
          close: 10,
        }),
      ]);

      await getBarsPromise;
    });

    expect(callback).not.toHaveBeenCalled();
    expect(serializeHookState(result.current)).toMatchSnapshot();
  });

  it('logs stale request errors without calling the historical callback', async () => {
    const deferred = createDeferred<KLineData[]>();
    const error = new Error('stale request failed');

    (getTokenPairKLineCandles as Mock).mockReturnValue(deferred.promise);

    const { result, rerender } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );
    const callback = vi.fn();

    const getBarsPromise = result.current.dataLoader.getBars(
      buildGetBarsParams({
        callback,
        type: 'init',
      }),
    );

    quoteToken = usdt;

    act(() => {
      rerender();
    });

    await act(async () => {
      deferred.reject(error);

      await getBarsPromise;
    });

    expect(callback).not.toHaveBeenCalled();
    expect(serializeHookState(result.current)).toMatchSnapshot();
  });

  it('subscribes to live candles, updates the same-period change, and ignores non-ohlc messages', async () => {
    (getTokenPairKLineCandles as Mock).mockResolvedValue([
      makeCandle({
        timestamp: 1000,
        close: 8,
      }),
      makeCandle({
        timestamp: 2000,
        close: 10,
      }),
    ]);

    const { result } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          type: 'init',
        }),
      );
    });

    const callback = vi.fn();

    act(() => {
      result.current.dataLoader.subscribeBar?.(
        buildSubscribeBarParams({
          callback,
        }),
      );
    });

    expect(wsKLineClient.subscribe).toHaveBeenCalledWith({
      baseToken,
      quoteToken,
      interval: fakeInterval,
      onMessage: expect.any(Function),
    });

    const onMessage = (wsKLineClient.subscribe as Mock).mock.calls[0][0].onMessage as (
      payload: ReturnType<typeof makeOhlcMessage> | ReturnType<typeof makeNonOhlcMessage>,
    ) => void;

    act(() => {
      onMessage(
        makeOhlcMessage({
          timestamp: 2000,
          close: 12,
        }),
      );
    });

    const stateAfterOhlc = serializeHookState(result.current);

    act(() => {
      onMessage(makeNonOhlcMessage());
    });

    expect(callback.mock.calls).toMatchSnapshot();
    expect({
      afterOhlc: stateAfterOhlc,
      afterNonOhlc: serializeHookState(result.current),
    }).toMatchSnapshot();
  });

  it('updates the change percentage against the latest historical candle for a new live period', async () => {
    (getTokenPairKLineCandles as Mock).mockResolvedValue([
      makeCandle({
        timestamp: 1000,
        close: 8,
      }),
      makeCandle({
        timestamp: 2000,
        close: 10,
      }),
    ]);

    const { result } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          type: 'init',
        }),
      );
    });

    const callback = vi.fn();

    act(() => {
      result.current.dataLoader.subscribeBar?.(
        buildSubscribeBarParams({
          callback,
        }),
      );
    });

    const onMessage = (wsKLineClient.subscribe as Mock).mock.calls[0][0].onMessage as (
      payload: ReturnType<typeof makeOhlcMessage>,
    ) => void;

    act(() => {
      onMessage(
        makeOhlcMessage({
          timestamp: 3000,
          close: 11,
        }),
      );
    });

    expect(callback.mock.calls).toMatchSnapshot();
    expect(serializeHookState(result.current)).toMatchSnapshot();
  });

  it('keeps changePercentage undefined when the comparison candle close is zero', async () => {
    (getTokenPairKLineCandles as Mock).mockResolvedValue([
      makeCandle({
        timestamp: 1000,
        close: 0,
      }),
      makeCandle({
        timestamp: 2000,
        close: 5,
      }),
    ]);

    const { result } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          type: 'init',
        }),
      );
    });

    expect(serializeHookState(result.current)).toMatchSnapshot();
  });

  it('unsubscribes with the captured handler and no-ops when there is no active subscription', () => {
    const { result } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );

    act(() => {
      result.current.dataLoader.unsubscribeBar?.({
        symbol: fakeSymbol,
        period: fakePeriod,
      });
    });

    expect(wsKLineClient.unsubscribe).not.toHaveBeenCalled();

    const callback = vi.fn();

    act(() => {
      result.current.dataLoader.subscribeBar?.(
        buildSubscribeBarParams({
          callback,
        }),
      );
    });

    const onMessage = (wsKLineClient.subscribe as Mock).mock.calls[0][0].onMessage;

    act(() => {
      result.current.dataLoader.unsubscribeBar?.({
        symbol: fakeSymbol,
        period: fakePeriod,
      });
    });

    expect(wsKLineClient.unsubscribe).toHaveBeenCalledWith({
      baseToken,
      quoteToken,
      interval: fakeInterval,
      onMessage,
    });
  });

  it('resets state when the source changes and ignores messages from the old subscription', async () => {
    (getTokenPairKLineCandles as Mock).mockResolvedValue([
      makeCandle({
        timestamp: 1000,
        close: 8,
      }),
      makeCandle({
        timestamp: 2000,
        close: 10,
      }),
    ]);

    const { result, rerender } = renderHook(() =>
      useGetLiveKLineCandles({
        baseToken,
        quoteToken,
        interval: fakeInterval,
        rangeMs: fakeRangeMs,
      }),
    );

    await act(async () => {
      await result.current.dataLoader.getBars(
        buildGetBarsParams({
          type: 'init',
        }),
      );
    });

    const callback = vi.fn();

    act(() => {
      result.current.dataLoader.subscribeBar?.(
        buildSubscribeBarParams({
          callback,
        }),
      );
    });

    const oldOnMessage = (wsKLineClient.subscribe as Mock).mock.calls[0][0].onMessage as (
      payload: ReturnType<typeof makeOhlcMessage>,
    ) => void;

    quoteToken = usdt;

    act(() => {
      rerender();
    });

    const stateAfterSourceChange = serializeHookState(result.current);

    act(() => {
      oldOnMessage(
        makeOhlcMessage({
          timestamp: 3000,
          close: 11,
        }),
      );
    });

    expect(callback).not.toHaveBeenCalled();
    expect({
      afterSourceChange: stateAfterSourceChange,
      afterOldMessage: serializeHookState(result.current),
    }).toMatchSnapshot();
  });
});
