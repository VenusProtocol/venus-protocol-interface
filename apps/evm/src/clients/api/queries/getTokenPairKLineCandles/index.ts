import { VError } from 'libs/errors';
import { formatToCandle } from 'utilities';
import { restService } from 'utilities/restService';
import type {
  GetTokenPairKLineCandlesApiResponse,
  GetTokenPairKLineCandlesInput,
  GetTokenPairKLineCandlesOutput,
} from './types';

export * from './types';

export const getTokenPairKLineCandles = async ({
  baseTokenAddress,
  quoteTokenAddress,
  startTimeMs,
  endTimeMs,
  interval = '5m',
}: GetTokenPairKLineCandlesInput): Promise<GetTokenPairKLineCandlesOutput> => {
  const response = await restService<GetTokenPairKLineCandlesApiResponse>({
    endpoint: '/ohlc/history',
    method: 'GET',
    params: {
      baseTokenAddress,
      quoteTokenAddress,
      startTimeMs,
      endTimeMs,
      interval,
    },
  });

  const payload = response.data;

  if (!payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: {
        exception: 'Could not fetch k-line candles from API',
      },
    });
  }

  if ('error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: {
        exception: payload.error,
      },
    });
  }

  return payload.result.map(formatToCandle);
};
