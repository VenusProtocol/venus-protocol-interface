import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetSwapQuoteInput,
  type GetSwapQuoteOutput,
  getSwapQuote,
} from 'clients/api/queries/getSwapQuote';
import FunctionKey from 'constants/functionKey';
import { zeroXApiUrl } from 'constants/swap';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetSwapQuoteInput = Omit<GetSwapQuoteInput, 'chainId' | 'apiUrl'>;

type Options = QueryObserverOptions<
  GetSwapQuoteOutput,
  Error,
  GetSwapQuoteOutput,
  GetSwapQuoteOutput,
  [FunctionKey.GET_SWAP_QUOTE, TrimmedGetSwapQuoteInput]
>;

export const useGetSwapQuote = (input: TrimmedGetSwapQuoteInput, options?: Options) => {
  const { chainId } = useChainId();
  const apiUrl =
    chainId in zeroXApiUrl ? zeroXApiUrl[chainId as keyof typeof zeroXApiUrl] : undefined;

  const { fromTokenAmountTokens, toTokenAmountTokens, ...requiredInput } = input;

  const enrichedInput = {
    ...requiredInput,
    chainId,
    // Only pass necessary props to prevent unnecessary requests
    ...(input.direction === 'exactAmountIn' ? { fromTokenAmountTokens } : { toTokenAmountTokens }),
  };

  return useQuery({
    queryKey: [FunctionKey.GET_SWAP_QUOTE, enrichedInput],
    queryFn: () =>
      callOrThrow({ apiUrl }, params =>
        getSwapQuote({
          ...enrichedInput,
          ...params,
        }),
      ),
    ...options,
  });
};
