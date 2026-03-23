import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import {
  type GetPendleSwapQuoteInput,
  type GetPendleSwapQuoteOutput,
  type PendleSwapQuoteError,
  getPendleSwapQuote,
} from '.';

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

  console.log('from:', input.fromToken.symbol, 'to:', input.toToken.symbol);

  return useQuery({
    queryKey: [FunctionKey.GET_PENDLE_SWAP_QUOTE, input],
    queryFn: () =>
      callOrThrow({}, params =>
        getPendleSwapQuote({ chainId, receiverAddress: accountAddress, ...input, ...params }),
      ),
    retry: false,
    refetchInterval,
    ...options,
  });
};
