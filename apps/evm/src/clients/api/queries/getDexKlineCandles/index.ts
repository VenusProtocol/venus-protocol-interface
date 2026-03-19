import config from 'config';
import { VError } from 'libs/errors';
import { createQueryParams } from 'utilities';
import type {
  GetApiDexKlineCandlesOutput,
  GetDexKlineCandlesInput,
  GetDexKlineCandlesOutput,
} from './types';

export * from './types';

export const getDexKlineCandles = async ({
  platform,
  address,
  interval,
  limit,
  from,
  to,
  unit,
  tokenIndex,
}: GetDexKlineCandlesInput): Promise<GetDexKlineCandlesOutput> => {
  const queryParams = createQueryParams({
    platform,
    address,
    interval,
    limit,
    from,
    to,
    unit,
    tokenIndex,
  });

  const response = await fetch(`${config.dexApiUrl}/k-line/candles?${queryParams}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const payload: GetApiDexKlineCandlesOutput = await response.json();

  const candles = (payload.data ?? []).map(([o, h, l, c, v, ts]) => ({
    timestamp: ts,
    open: o,
    high: h,
    low: l,
    close: c,
    volume: v,
  }));

  return { candles };
};
