import {
  type InfiniteData,
  type InfiniteQueryObserverOptions,
  useInfiniteQuery,
} from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import {
  type GetTokenPairKLineCandlesInput,
  type GetTokenPairKLineCandlesOutput,
  getTokenPairKLineCandles,
} from '..';

export type UseGetTokenPairKLineCandlesQueryKey = [
  FunctionKey.GET_TOKEN_PAIR_K_LINE_CANDLES,
  UseGetTokenPairKLineCandlesInput,
];

type Data = InfiniteData<GetTokenPairKLineCandlesOutput, number>;

type Options = InfiniteQueryObserverOptions<
  GetTokenPairKLineCandlesOutput,
  Error,
  Data,
  UseGetTokenPairKLineCandlesQueryKey,
  number
>;

export interface UseGetTokenPairKLineCandlesInput
  extends Omit<GetTokenPairKLineCandlesInput, 'startTimeMs' | 'endTimeMs'> {
  rangeMs: number;
}

export const useGetTokenPairKLineCandles = (
  input: UseGetTokenPairKLineCandlesInput,
  options?: Partial<Options>,
) =>
  useInfiniteQuery({
    queryKey: [FunctionKey.GET_TOKEN_PAIR_K_LINE_CANDLES, input],
    queryFn: ({ pageParam: endTimeMs }) =>
      getTokenPairKLineCandles({
        baseTokenAddress: input.baseTokenAddress,
        quoteTokenAddress: input.quoteTokenAddress,
        startTimeMs: Math.max(0, endTimeMs - input.rangeMs),
        endTimeMs,
      }),
    initialPageParam: new Date().getTime(),
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === 0 ? undefined : lastPageParam - input.rangeMs - 1,
    ...options,
  });
