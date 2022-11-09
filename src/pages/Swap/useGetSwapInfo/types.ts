import {
  Currency as PSCurrency,
  Trade as PSTrade,
  TradeType as PSTradeType,
} from '@pancakeswap/sdk/dist/index.js';
import { Swap, SwapDirection, Token } from 'types';

export type SwapError = 'INSUFFICIENT_LIQUIDITY' | 'WRAPPING_UNWRAPPING_UNSUPPORTED';

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
}

export interface FormatToSwapInput {
  input: UseGetSwapInfoInput;
  trade: PSTrade<PSCurrency, PSCurrency, PSTradeType>;
}

export type FormatToSwapOutput = Swap;
