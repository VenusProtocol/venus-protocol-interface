import BigNumber from 'bignumber.js';
import config from 'config';
import { MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { VError, logError } from 'libs/errors';
import type { ChainId, Swap, SwapDirection, SwapError, Token } from 'types';
import { convertTokensToMantissa } from 'utilities';
import formatToSwap from './formatToSwap';

export type GetSwapQuoteInput = {
  apiUrl: string;
  chainId: ChainId;
  fromToken: Token;
  toToken: Token;
  direction: SwapDirection;
  fromTokenAmountTokens?: string;
  toTokenAmountTokens?: string;
};

export type GetSwapQuoteOutput =
  | {
      swap?: Swap;
      error?: SwapError;
    }
  | undefined;

export const getSwapQuote = async ({
  apiUrl,
  chainId,
  fromToken,
  toToken,
  direction,
  fromTokenAmountTokens,
  toTokenAmountTokens,
}: GetSwapQuoteInput) => {
  const result: {
    swap: Swap | undefined;
    error: SwapError | undefined;
  } = {
    swap: undefined,
    error: undefined,
  };

  if (
    (direction === 'exactAmountIn' && (!fromTokenAmountTokens || +fromTokenAmountTokens === 0)) ||
    (direction === 'exactAmountOut' && (!toTokenAmountTokens || +toTokenAmountTokens === 0))
  ) {
    return result;
  }

  const sharedParams = {
    fromChain: chainId.toString(),
    toChain: chainId.toString(),
    sellToken: fromToken.address,
    buyToken: toToken.address,
    slippagePercentage: (SLIPPAGE_TOLERANCE_PERCENTAGE / 100).toString(),
    priceImpactProtectionPercentage: (MAXIMUM_PRICE_IMPACT_THRESHOLD_PERCENTAGE / 100).toString(),
    skipValidation: 'true',
    // TODO: add fee props
  };

  const params =
    direction === 'exactAmountIn'
      ? {
          ...sharedParams,
          sellAmount: convertTokensToMantissa({
            value: new BigNumber(fromTokenAmountTokens!),
            token: fromToken,
          }).toFixed(),
        }
      : {
          ...sharedParams,
          buyAmount: convertTokensToMantissa({
            value: new BigNumber(toTokenAmountTokens!),
            token: toToken,
          }).toFixed(),
        };

  const endpoint = `${apiUrl}/swap/v1/quote?${new URLSearchParams(params).toString()}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        '0x-api-key': config.zeroXApiKey,
      },
    });

    const quote = await response.json();

    // Detect error
    if ('code' in quote) {
      result.error = 'INSUFFICIENT_LIQUIDITY';
    } else {
      result.swap = formatToSwap({
        fromToken,
        toToken,
        direction,
        quote,
      });
    }

    return result;
  } catch (error) {
    logError(error);

    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
    });
  }
};
