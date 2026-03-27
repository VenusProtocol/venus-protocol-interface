import { VError } from 'libs/errors';
import type { pendleSwapQuoteErrorPhrases } from 'libs/errors/pendleSwapQuoteErrorPhrases';

import { convertTokensToMantissa, restService } from 'utilities';
import { formatOutput } from './formatOutput';
import type {
  GetPendleSwapQuoteInput,
  GetPendleSwapQuoteOutput,
  PendleSwapApiResponse,
} from './types';

export * from './types';

export const getPendleSwapQuote = async ({
  chainId,
  fromToken,
  toToken,
  amountTokens,
  slippagePercentage,
  receiverAddress,
}: GetPendleSwapQuoteInput): Promise<GetPendleSwapQuoteOutput> => {
  const response = await restService<PendleSwapApiResponse>({
    endpoint: '/pendle/swap-calldata',
    method: 'GET',
    params: {
      chainId,
      tokenInAddress: fromToken.address,
      tokenOutAddress: toToken.address,
      amountInMantissa: convertTokensToMantissa({
        value: amountTokens,
        token: fromToken,
      }),
      slippagePercentage,
      receiverAddress,
    },
  });

  if (!response.data) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }

  if ('code' in response.data && response.data.code) {
    throw new VError({
      type: 'pendleSwapQuote',
      code: response.data.code as keyof typeof pendleSwapQuoteErrorPhrases,
      data: { exception: response.data?.error },
    });
  }

  if (response.data && 'error' in response.data) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: (response.data as { error: unknown }).error },
    });
  }

  return formatOutput(response.data);
};
