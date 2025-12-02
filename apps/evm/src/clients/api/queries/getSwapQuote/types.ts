import type { ChainId, Token } from '@venusprotocol/chains';
import type { SwapQuote } from 'types';
import type { Address, Hex } from 'viem';

export interface ApiSwapQuote {
  amountIn: string;
  amountInMax: string;
  amountOut: string;
  amountOutMin: string;
  protocol: string;
  priceImpact: number;
  swapHelperMulticall: {
    target: Address;
    calldata: {
      encodedCall: Hex;
    };
  };
}

export interface SwapApiResponse {
  quotes: ApiSwapQuote[];
}

interface GetSwapQuoteBase {
  chainId: ChainId;
  recipientAddress: Address;
  fromToken: Token;
  toToken: Token;
  direction: SwapQuote['direction'];
  slippagePercentage: number;
}

export interface GetExactInSwapQuoteInput extends GetSwapQuoteBase {
  fromTokenAmountTokens: BigNumber;
  direction: 'exact-in';
}

export interface GetExactOutSwapQuoteInput extends GetSwapQuoteBase {
  toTokenAmountTokens: BigNumber;
  direction: 'exact-out';
}

export interface GetApproximateOutSwapQuoteInput extends GetSwapQuoteBase {
  minToTokenAmountTokens: BigNumber;
  direction: 'approximate-out';
}

export type GetSwapQuoteInput =
  | GetExactInSwapQuoteInput
  | GetExactOutSwapQuoteInput
  | GetApproximateOutSwapQuoteInput;

export type GetSwapQuoteOutput = {
  swapQuote: SwapQuote | undefined;
};
