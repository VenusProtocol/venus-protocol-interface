import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId } from 'libs/wallet';
import type { SwapQuoteError } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';
import {
  type GetApproximateOutSwapQuoteInput,
  type GetExactInSwapQuoteInput,
  type GetExactOutSwapQuoteInput,
  type GetSwapQuoteOutput,
  getSwapQuote,
} from '.';

export type TrimmedGetSwapQuoteInput =
  | Omit<GetExactInSwapQuoteInput, 'chainId'>
  | Omit<GetExactOutSwapQuoteInput, 'chainId'>
  | Omit<GetApproximateOutSwapQuoteInput, 'chainId'>;

type Options = QueryObserverOptions<
  GetSwapQuoteOutput,
  SwapQuoteError,
  GetSwapQuoteOutput,
  GetSwapQuoteOutput,
  [FunctionKey.GET_SWAP_QUOTE, TrimmedGetSwapQuoteInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetSwapQuote = (input: TrimmedGetSwapQuoteInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_SWAP_QUOTE, input],
    queryFn: () =>
      callOrThrow({ leverageManagerContractAddress }, params =>
        getSwapQuote({
          ...input,
          chainId,
          recipientAddress: params.leverageManagerContractAddress,
        }),
      ),
    retry: false,
    refetchInterval,
    ...options,
  });
};
