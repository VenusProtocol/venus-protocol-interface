import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import {
  type GetPendleSwapQuoteInput,
  type GetPendleSwapQuoteOutput,
  type PendleSwapQuoteError,
  getPendleSwapQuote,
} from '.';
import wrapToken from '../getSwapQuote/wrapToken';

export type UseGetPendleSwapQuoteInput = Omit<
  GetPendleSwapQuoteInput,
  'chainId' | 'receiverAddress'
>;

type Options = QueryObserverOptions<
  GetPendleSwapQuoteOutput,
  PendleSwapQuoteError,
  GetPendleSwapQuoteOutput,
  GetPendleSwapQuoteOutput,
  [FunctionKey.GET_PENDLE_SWAP_QUOTE, UseGetPendleSwapQuoteInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetPendleSwapQuote = (
  input: UseGetPendleSwapQuoteInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  const wbnb = useGetToken({
    symbol: 'WBNB',
  });

  const wrappedFromToken = wbnb && wrapToken({ token: input.fromToken, wrappedToken: wbnb });

  return useQuery({
    queryKey: [FunctionKey.GET_PENDLE_SWAP_QUOTE, input],
    queryFn: () =>
      callOrThrow(
        {
          fromToken: wrappedFromToken,
        },
        params =>
          getPendleSwapQuote({ chainId, receiverAddress: accountAddress, ...input, ...params }),
      ),
    retry: false,
    refetchInterval,
    ...options,
  });
};
