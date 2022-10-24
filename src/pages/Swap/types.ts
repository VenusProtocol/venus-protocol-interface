import BigNumber from 'bignumber.js';
import { Token } from 'types';

interface SwapBase {
  fromToken: Token;
  toToken: Token;
  exchangeRate: BigNumber;
  direction: 'exactAmountIn' | 'exactAmountOut';
}

export interface ExactAmountInSwap extends SwapBase {
  fromTokenAmountSoldWei: BigNumber;
  expectedToTokenAmountReceivedWei: BigNumber;
  minimumToTokenAmountReceivedWei: BigNumber;
  direction: 'exactAmountIn';
}

export interface ExactAmountOutSwap extends SwapBase {
  expectedFromTokenAmountSoldWei: BigNumber;
  maximumFromTokenAmountSoldWei: BigNumber;
  toTokenAmountReceivedWei: BigNumber;
  direction: 'exactAmountOut';
}

export type Swap = ExactAmountInSwap | ExactAmountOutSwap;
