import { VError } from 'errors';
import { Swap } from 'types';
import type { TransactionReceipt } from 'web3-core';

import { PancakeRouter } from 'types/contracts';

export interface SwapTokensInput {
  pancakeRouterContract: PancakeRouter;
  fromAccountAddress: string;
  swap: Swap;
}

export type SwapTokensOutput = TransactionReceipt;

const TRANSACTION_DEADLINE_MS = 60 * 1000 * 10; // 10 minutes

const swapTokens = async ({
  pancakeRouterContract,
  fromAccountAddress,
  swap,
}: SwapTokensInput): Promise<SwapTokensOutput> => {
  const transactionDeadline = new Date().getTime() + TRANSACTION_DEADLINE_MS;

  // Sell fromTokens for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return pancakeRouterContract.methods
      .swapExactTokensForTokens(
        swap.fromTokenAmountSoldWei.toFixed(),
        swap.minimumToTokenAmountReceivedWei.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      )
      .send({ from: fromAccountAddress });
  }

  // Sell BNBs for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return pancakeRouterContract.methods
      .swapExactETHForTokens(
        swap.minimumToTokenAmountReceivedWei.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      )
      .send({ from: fromAccountAddress, value: swap.fromTokenAmountSoldWei.toFixed() });
  }

  // Sell fromTokens for as many BNBs as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return pancakeRouterContract.methods
      .swapExactTokensForETH(
        swap.fromTokenAmountSoldWei.toFixed(),
        swap.minimumToTokenAmountReceivedWei.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      )
      .send({ from: fromAccountAddress });
  }

  // Buy toTokens by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return pancakeRouterContract.methods
      .swapTokensForExactTokens(
        swap.toTokenAmountReceivedWei.toFixed(),
        swap.maximumFromTokenAmountSoldWei.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      )
      .send({ from: fromAccountAddress });
  }

  // Buy toTokens by selling as few BNBs as possible
  if (swap.direction === 'exactAmountOut' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return pancakeRouterContract.methods
      .swapETHForExactTokens(
        swap.toTokenAmountReceivedWei.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      )
      .send({ from: fromAccountAddress, value: swap.maximumFromTokenAmountSoldWei.toFixed() });
  }

  // Buy BNBs by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return pancakeRouterContract.methods
      .swapTokensForExactETH(
        swap.toTokenAmountReceivedWei.toFixed(),
        swap.maximumFromTokenAmountSoldWei.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      )
      .send({ from: fromAccountAddress });
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokens;
