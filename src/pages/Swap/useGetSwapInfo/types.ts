import {
  Currency as PSCurrency,
  Trade as PSTrade,
  TradeType as PSTradeType,
} from '@pancakeswap/sdk/dist/index.js';
import { Token } from 'types';

import { Swap, SwapDirection } from '../types';

export interface UseGetSwapInfoInput {
  fromToken: Token;
  toToken: Token;
  direction: SwapDirection;
  fromTokenAmountTokens?: string;
  toTokenAmountTokens?: string;
}

export type UseGetSwapInfoOutput = Swap | undefined;

export interface FormatToSwapInput {
  input: UseGetSwapInfoInput;
  trade: PSTrade<PSCurrency, PSCurrency, PSTradeType>;
}

export type FormatToSwapOutput = Swap;
