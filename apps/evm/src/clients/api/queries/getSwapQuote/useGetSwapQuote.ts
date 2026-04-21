import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { isEqual } from 'lodash-es';

import FunctionKey from 'constants/functionKey';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import type { ChainId, SwapQuoteError } from 'types';
import callOrThrow from 'utilities/callOrThrow';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import {
  type GetApproximateOutSwapQuoteInput,
  type GetExactInSwapQuoteInput,
  type GetExactOutSwapQuoteInput,
  type GetSwapQuoteOutput,
  getSwapQuote,
} from '.';
import wrapToken from './wrapToken';

export type TrimmedGetSwapQuoteInput =
  | Omit<GetExactInSwapQuoteInput, 'chainId'>
  | Omit<GetExactOutSwapQuoteInput, 'chainId'>
  | Omit<GetApproximateOutSwapQuoteInput, 'chainId'>;

type QueryKey = [
  FunctionKey.GET_SWAP_QUOTE,
  TrimmedGetSwapQuoteInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetSwapQuoteOutput,
  SwapQuoteError,
  GetSwapQuoteOutput,
  GetSwapQuoteOutput,
  QueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval('fast');

export const useGetSwapQuote = (input: TrimmedGetSwapQuoteInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const wbnb = useGetToken({
    symbol: 'WBNB',
  });

  const wrappedFromToken = wbnb && wrapToken({ token: input.fromToken, wrappedToken: wbnb });
  const wrappedToToken = wbnb && wrapToken({ token: input.toToken, wrappedToken: wbnb });

  const queryKey: QueryKey = [FunctionKey.GET_SWAP_QUOTE, { ...input, chainId }];

  return useQuery({
    queryKey,
    queryFn: () =>
      callOrThrow(
        {
          fromToken: wrappedFromToken,
          toToken: wrappedToToken,
        },
        params =>
          getSwapQuote({
            ...input,
            ...params,
            chainId,
          }),
      ),
    retry: false,
    placeholderData: (previousData, previousQuery) =>
      isEqual(queryKey, previousQuery?.queryKey) ? previousData : undefined,
    refetchInterval,
    ...options,
  });
};
