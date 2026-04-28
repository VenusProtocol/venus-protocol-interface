import BigNumber from 'bignumber.js';
import type { DataLoader, DataLoaderGetBarsParams, KLineData } from 'klinecharts';
import { useEffect, useMemo, useRef, useState } from 'react';

import { getTokenPairKLineCandles } from 'clients/api';
import type { ApiOhlcInterval, Token } from 'types';
import { formatToCandle } from 'utilities';
import { type WsKLineMessage, wsKLineClient } from './wsKLineClient';

export const useGetLiveKLineCandles = ({
  baseToken,
  quoteToken,
  interval,
  baseTokenPriceCents,
  quoteTokenPriceCents,
  rangeMs,
}: {
  baseToken: Token;
  quoteToken: Token;
  interval: ApiOhlcInterval;
  rangeMs: number;
  baseTokenPriceCents?: BigNumber;
  quoteTokenPriceCents?: BigNumber;
}) => {
  const sourceId = `${baseToken.address}-${quoteToken.address}-${rangeMs}-${interval}`;
  const activeSourceIdRef = useRef(sourceId);
  activeSourceIdRef.current = sourceId;

  const liveSubscriptionRef = useRef<((data: WsKLineMessage) => void) | undefined>(undefined);
  const [latestHistoricalCandle, setLatestHistoricalCandle] = useState<KLineData | undefined>(
    undefined,
  );
  const [previousHistoricalCandle, setPreviousHistoricalCandle] = useState<KLineData | undefined>(
    undefined,
  );
  const [liveCandle, setLiveCandle] = useState<KLineData | undefined>(undefined);

  // Reset candles when source changes
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setLatestHistoricalCandle(undefined);
    setPreviousHistoricalCandle(undefined);
    setLiveCandle(undefined);
  }, [sourceId]);

  const dataLoader = useMemo<DataLoader>(
    () => ({
      getBars: async ({ callback, timestamp, type }: DataLoaderGetBarsParams) => {
        // We only allow going back in time
        if (type === 'backward') {
          callback([], {
            backward: false,
            forward: false,
          });

          return;
        }

        const endTimeMs = timestamp ?? Date.now();
        const startTimeMs = endTimeMs - rangeMs;

        try {
          const candles = await getTokenPairKLineCandles({
            baseTokenAddress: baseToken.address,
            quoteTokenAddress: quoteToken.address,
            startTimeMs,
            endTimeMs,
            interval,
          });

          const sortedCandles = [...candles].sort(
            (leftCandle, rightCandle) => leftCandle.timestamp - rightCandle.timestamp,
          );

          if (activeSourceIdRef.current !== sourceId) {
            return;
          }

          if (type === 'init') {
            setLatestHistoricalCandle(sortedCandles.at(-1));
            setPreviousHistoricalCandle(sortedCandles.at(-2));
          }

          callback(sortedCandles, {
            backward: false,
            forward: sortedCandles.length > 0 && startTimeMs > 0,
          });
        } catch (_e) {
          if (activeSourceIdRef.current === sourceId) {
            callback([], {
              backward: false,
              forward: false,
            });
          }
        }
      },
      subscribeBar: ({ callback }) => {
        const handleMessage = (data: WsKLineMessage) => {
          if (data.type !== 'ohlc' || activeSourceIdRef.current !== sourceId) {
            return;
          }

          const candle = formatToCandle(data.data);

          setLiveCandle(candle);
          callback(candle);
        };

        liveSubscriptionRef.current = handleMessage;

        wsKLineClient.subscribe({
          baseToken,
          quoteToken,
          interval,
          onMessage: handleMessage,
        });
      },
      unsubscribeBar: () => {
        if (!liveSubscriptionRef.current) {
          return;
        }

        wsKLineClient.unsubscribe({
          baseToken,
          quoteToken,
          interval,
          onMessage: liveSubscriptionRef.current,
        });

        liveSubscriptionRef.current = undefined;
      },
    }),
    [baseToken, quoteToken, rangeMs, sourceId, interval],
  );

  const changePercentage = useMemo(() => {
    const currentCandle = liveCandle ?? latestHistoricalCandle;

    if (!currentCandle) {
      return undefined;
    }

    const isNewPeriod =
      !!liveCandle &&
      !!latestHistoricalCandle &&
      liveCandle.timestamp > latestHistoricalCandle.timestamp;

    const comparisonCandle =
      liveCandle && isNewPeriod ? latestHistoricalCandle : previousHistoricalCandle;

    if (!comparisonCandle || comparisonCandle.close === 0) {
      return undefined;
    }

    return ((currentCandle.close - comparisonCandle.close) / comparisonCandle.close) * 100;
  }, [latestHistoricalCandle, liveCandle, previousHistoricalCandle]);

  const priceCentsRatio = useMemo(() => {
    const currentCandle = liveCandle ?? latestHistoricalCandle;

    if (currentCandle) {
      return new BigNumber(currentCandle.close);
    }

    if (baseTokenPriceCents && quoteTokenPriceCents) {
      return baseTokenPriceCents.div(quoteTokenPriceCents);
    }

    return undefined;
  }, [latestHistoricalCandle, liveCandle, baseTokenPriceCents, quoteTokenPriceCents]);

  return {
    changePercentage,
    dataLoader,
    priceCentsRatio,
  };
};
