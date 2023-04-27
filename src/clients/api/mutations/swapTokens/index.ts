import { VError } from 'errors';
import { ContractReceipt } from 'ethers';
import { Swap } from 'types';
import { generateTransactionDeadline } from 'utilities';

import { PancakeRouter } from 'types/contracts';

export interface SwapTokensInput {
  pancakeRouterContract: PancakeRouter;
  swap: Swap;
}

export type SwapTokensOutput = ContractReceipt;

const swapTokens = async ({
  pancakeRouterContract,
  swap,
}: SwapTokensInput): Promise<SwapTokensOutput> => {
  const transactionDeadline = generateTransactionDeadline();
  const fromAccountAddress = await pancakeRouterContract.signer.getAddress();

  // Sell fromTokens for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await pancakeRouterContract.swapExactTokensForTokens(
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // Sell BNBs for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await pancakeRouterContract.swapExactETHForTokens(
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
      { value: swap.fromTokenAmountSoldWei.toFixed() },
    );
    return transaction.wait(1);
  }

  // Sell fromTokens for as many BNBs as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
    const transaction = await pancakeRouterContract.swapExactTokensForETH(
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // Buy toTokens by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await pancakeRouterContract.swapTokensForExactTokens(
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // Buy toTokens by selling as few BNBs as possible
  if (swap.direction === 'exactAmountOut' && swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await pancakeRouterContract.swapETHForExactTokens(
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
      { value: swap.maximumFromTokenAmountSoldWei.toFixed() },
    );
    return transaction.wait(1);
  }

  // Buy BNBs by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && swap.toToken.isNative) {
    const transaction = await pancakeRouterContract.swapTokensForExactETH(
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokens;
