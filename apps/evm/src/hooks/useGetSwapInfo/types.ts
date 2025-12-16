import type {
  Currency as PSCurrency,
  Trade as PSTrade,
  TradeType as PSTradeType,
} from '@pancakeswap/sdk';

import type { Swap, SwapDirection, SwapError, Token } from 'types';

export interface UseGetSwapInfoOptions {
  enabled: boolean;
}

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
