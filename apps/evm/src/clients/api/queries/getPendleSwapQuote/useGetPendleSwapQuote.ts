import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';
import type { Address } from 'viem';
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
  [FunctionKey.GET_PENDLE_SWAP_QUOTE, UseGetPendleSwapQuoteInput, ChainId, Address]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetPendleSwapQuote = (
  input: UseGetPendleSwapQuoteInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return useQuery({
    queryKey: [FunctionKey.GET_PENDLE_SWAP_QUOTE, input, chainId, accountAddress ?? NULL_ADDRESS],
    queryFn: () =>
      callOrThrow({}, params =>
        getPendleSwapQuote({ chainId, receiverAddress: accountAddress, ...input, ...params }),
      ),
    retry: false,
    refetchInterval,
    ...options,
  });
};
