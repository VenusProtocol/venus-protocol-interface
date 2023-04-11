import { VError } from 'errors';
import { ContractReceipt } from 'ethers';
import { Swap, VToken } from 'types';

import { SwapRouter } from 'types/contracts';

export interface SwapTokensAndRepayInput {
  swapRouterContract: SwapRouter;
  swap: Swap;
  vToken: VToken;
  isRepayingFullLoan: boolean;
}

export type SwapTokensAndRepayOutput = ContractReceipt;

const TRANSACTION_DEADLINE_MS = 60 * 1000 * 10; // 10 minutes

const swapTokensAndRepay = async ({
  swapRouterContract,
  swap,
  vToken,
  isRepayingFullLoan = false,
}: SwapTokensAndRepayInput): Promise<SwapTokensAndRepayOutput> => {
  const transactionDeadline = new Date().getTime() + TRANSACTION_DEADLINE_MS;

  // Repay full loan in tokens using tokens
  if (
    isRepayingFullLoan &&
    swap.direction === 'exactAmountOut' &&
    !swap.fromToken.isNative &&
    !swap.toToken.isNative
  ) {
    const transaction = await swapRouterContract.swapTokensForFullTokenDebtAndRepay(
      vToken.address,
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // Repay full loan in BNBs using tokens
  if (
    isRepayingFullLoan &&
    swap.direction === 'exactAmountOut' &&
    !swap.fromToken.isNative &&
    swap.toToken.isNative
  ) {
    const transaction = await swapRouterContract.swapTokensForFullETHDebtAndRepay(
      vToken.address,
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // TODO: handle repaying full loan in tokens using BNBs

  // Sell fromTokens to repay as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapAndRepay(
      vToken.address,
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // Sell BNBs to repay as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapBnbAndRepay(
      vToken.address,
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
      { value: swap.fromTokenAmountSoldWei.toFixed() },
    );
    return transaction.wait(1);
  }

  // Sell fromTokens to repay as many BNBs as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapExactTokensForETHAndRepay(
      vToken.address,
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // Repay toTokens by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapTokensForExactTokensAndRepay(
      vToken.address,
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // Repay toTokens by selling as few BNBs as possible
  if (swap.direction === 'exactAmountOut' && swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapETHForExactTokensAndRepay(
      vToken.address,
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
      { value: swap.maximumFromTokenAmountSoldWei.toFixed() },
    );
    return transaction.wait(1);
  }

  // Repay BNBs by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapTokensForExactETHAndRepay(
      vToken.address,
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokensAndRepay;
