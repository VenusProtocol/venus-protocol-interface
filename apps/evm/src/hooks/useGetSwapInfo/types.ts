import type {
  Currency as PSCurrency,
  Trade as PSTrade,
  TradeType as PSTradeType,
} from '@pancakeswap/sdk/dist/index.js';

import type { Swap, SwapDirection, SwapError, Token } from 'types';

export interface UseGetSwapInfoInput {
  fromToken: Token;
  toToken: Token;
  direction: SwapDirection;
  fromTokenAmountTokens?: string;
  toTokenAmountTokens?: string;
}

export interface UseGetSwapInfoOutput {
  swap: Swap | undefined;
  error: SwapError | undefined;
  isLoading: boolean;
}

export interface FormatToSwapInput {
  input: UseGetSwapInfoInput;
  trade: PSTrade<PSCurrency, PSCurrency, PSTradeType>;
}

export type FormatToSwapOutput = Swap;
