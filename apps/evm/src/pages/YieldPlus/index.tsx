import { useSearchParams } from 'react-router';

import { useDexKlineWebSocket, useGetDexKlineCandles } from 'clients/api';
import type { DexKlineCandle } from 'clients/api';
import { Card, KLineChart, Page } from 'components';
import { useGetTokens } from 'libs/tokens';
import { useEffect, useMemo, useState } from 'react';
import { areAddressesEqual } from 'utilities';
import { Banner } from './Banner';
import { store } from './Banner/store';
import { PairInfo } from './PairInfo';
import { Positions } from './Positions';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from './constants';
import { useTokenPair } from './useTokenPair';

const KLINE_INTERVAL = '1d' as const;
const KLINE_LIMIT = 300;

const YieldPlus: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { shortToken, longToken } = useTokenPair();
  const tokens = useGetTokens();

  const longTokenAddressParam = searchParams.get(LONG_TOKEN_ADDRESS_PARAM_KEY);
  const shortTokenAddressParam = searchParams.get(SHORT_TOKEN_ADDRESS_PARAM_KEY);

  const doNotShowBanner = store.use.doNotShowBanner();

  const longTokenDexAddress = useMemo(() => {
    if (!longToken.isNative) return longToken.address;
    const wrappedToken = tokens.find(t =>
      areAddressesEqual(t.tokenWrapped?.address ?? '', longToken.address),
    );
    return wrappedToken?.address ?? longToken.address;
  }, [longToken, tokens]);

  const { data: klineData } = useGetDexKlineCandles({
    address: longTokenDexAddress,
    interval: KLINE_INTERVAL,
    limit: KLINE_LIMIT,
  });

  const [liveCandle, setLiveCandle] = useState<DexKlineCandle | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally watching address changes to reset live candle
  useEffect(() => {
    setLiveCandle(undefined);
  }, [longTokenDexAddress]);

  useDexKlineWebSocket({
    address: longTokenDexAddress,
    interval: KLINE_INTERVAL,
    onCandle: setLiveCandle,
  });

  const changePercentage = useMemo(() => {
    const lastCandle = liveCandle ?? klineData?.candles?.at(-1);
    const prevCandle = klineData?.candles?.at(-2);
    if (!lastCandle || !prevCandle || prevCandle.close === 0) return undefined;
    return ((lastCandle.close - prevCandle.close) / prevCandle.close) * 100;
  }, [liveCandle, klineData]);

  // Update token search params if they are empty or incorrect
  useEffect(() => {
    if (
      shortToken.address !== shortTokenAddressParam ||
      longToken.address !== longTokenAddressParam
    ) {
      setSearchParams(
        currentSearchParams => ({
          ...Object.fromEntries(currentSearchParams),
          [SHORT_TOKEN_ADDRESS_PARAM_KEY]: String(shortToken.address),
          [LONG_TOKEN_ADDRESS_PARAM_KEY]: String(longToken.address),
        }),
        {
          replace: true,
        },
      );
    }
  }, [shortToken, longToken, longTokenAddressParam, shortTokenAddressParam, setSearchParams]);

  return (
    <Page>
      <div className="flex flex-col gap-y-6 lg:grid lg:grid-cols-[6fr_4fr] lg:gap-6 xl:grid-cols-[8fr_4fr]">
        <div className="flex flex-col gap-y-6">
          <PairInfo changePercentage={changePercentage} />

          {!doNotShowBanner && <Banner className="lg:hidden" />}

          <Card className="p-0 overflow-hidden bg-dark-blue h-80 shrink-0 lg:h-114">
            <KLineChart
              title={`${longToken.symbol}/${shortToken.symbol}`}
              data={klineData?.candles ?? []}
              liveCandle={liveCandle}
            />
          </Card>

          <Positions />
        </div>

        <div>{!doNotShowBanner && <Banner className="hidden lg:flex" />}</div>
      </div>
    </Page>
  );
};

export default YieldPlus;
