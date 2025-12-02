import { VError } from 'libs/errors';
import { convertTokensToMantissa, generateTransactionDeadline, restService } from 'utilities';
import { formatSwapQuote } from './formatSwapQuote';
import type { GetSwapQuoteInput, GetSwapQuoteOutput, SwapApiResponse } from './types';

export * from './types';

export const getSwapQuote = async ({
  chainId,
  fromToken,
  toToken,
  slippagePercentage,
  recipientAddress,
  ...swapSpecificProps
}: GetSwapQuoteInput): Promise<GetSwapQuoteOutput> => {
  const transactionDeadline = generateTransactionDeadline();

  const params: Record<string, number | string | boolean> = {
    chainId,
    tokenInAddress: fromToken.address,
    tokenOutAddress: toToken.address,
    slippagePercentage,
    recipientAddress,
    deadlineTimestampSecs: Number(transactionDeadline),
    type: swapSpecificProps.direction,
    shouldTransferToReceiver: true,
  };

  if (swapSpecificProps.direction === 'exact-in') {
    params.exactAmountInMantissa = convertTokensToMantissa({
      value: swapSpecificProps.fromTokenAmountTokens,
      token: fromToken,
    }).toFixed();
  } else if (swapSpecificProps.direction === 'exact-out') {
    params.exactAmountOutMantissa = convertTokensToMantissa({
      value: swapSpecificProps.toTokenAmountTokens,
      token: fromToken,
    }).toFixed();
  } else {
    // Approximate out swap
    params.minAmountOutMantissa = convertTokensToMantissa({
      value: swapSpecificProps.minToTokenAmountTokens,
      token: fromToken,
    }).toFixed();
  }

  const txsResponse = await restService<SwapApiResponse>({
    endpoint: '/find-swap/pcs',
    method: 'GET',
    params,
  });

  if (txsResponse.data && 'error' in txsResponse.data) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: txsResponse.data.error },
    });
  }

  if (!txsResponse.data) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  if (txsResponse.data.quotes.length === 0) {
    throw new VError({ type: 'swapQuote', code: 'noSwapQuoteFound' });
  }

  const apiSwapQuote = txsResponse.data.quotes[0];

  const swapQuote = formatSwapQuote({
    apiSwapQuote,
    direction: swapSpecificProps.direction,
    slippagePercentage: Number(params.slippagePercentage),
    fromToken,
    toToken,
  });

  return {
    swapQuote,
  };
};
