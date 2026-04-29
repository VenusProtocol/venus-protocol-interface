import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import {
  type GetPendleSwapQuoteInput,
  type GetPendleSwapQuoteOutput,
  type PendleSwapQuoteError,
  getPendleSwapQuote,
} from '.';

export type TrimmedGetPendleSwapQuoteInput = Omit<
  GetPendleSwapQuoteInput,
  'chainId' | 'receiverAddress'
>;

type Options = QueryObserverOptions<
  GetPendleSwapQuoteOutput,
  PendleSwapQuoteError,
  GetPendleSwapQuoteOutput,
  GetPendleSwapQuoteOutput,
  [FunctionKey.GET_PENDLE_SWAP_QUOTE, GetPendleSwapQuoteInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval('fast');

export const useGetPendleSwapQuote = (
  input: TrimmedGetPendleSwapQuoteInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { accountAddress: receiverAddress } = useAccountAddress();

  return useQuery({
    queryKey: [
      FunctionKey.GET_PENDLE_SWAP_QUOTE,
      {
        ...input,
        chainId,
        receiverAddress,
      },
    ],
    queryFn: params => getPendleSwapQuote({ chainId, receiverAddress, ...input, ...params }),
    retry: false,
    refetchInterval,
    ...options,
  });
};
