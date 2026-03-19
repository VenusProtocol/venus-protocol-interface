import { VError } from 'libs/errors';
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
  amount,
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
        value: amount,
        token: fromToken,
      }),
      slippagePercentage,
      receiverAddress,
    },
  });

  if (response.data && 'error' in response.data) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: (response.data as { error: unknown }).error },
    });
  }

  if (!response.data) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return formatOutput(response.data);
};
