import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetToken } from 'libs/tokens';
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
import wrapToken from './wrapToken';

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
  const wbnb = useGetToken({
    symbol: 'WBNB',
  });

  const wrappedFromToken = wrapToken({ token: input.fromToken, wrappedToken: wbnb });
  const wrappedToToken = wrapToken({ token: input.toToken, wrappedToken: wbnb });

  const { address: SwapRouterV2ContractAddress } = useGetContractAddress({
    name: 'SwapRouterV2',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_SWAP_QUOTE, input],
    queryFn: () =>
      callOrThrow({ SwapRouterV2ContractAddress }, params =>
        getSwapQuote({
          ...input,
          chainId,
          fromToken: wrappedFromToken,
          toToken: wrappedToToken,
          recipientAddress: params.SwapRouterV2ContractAddress,
        }),
      ),
    retry: false,
    refetchInterval,
    ...options,
  });
};
