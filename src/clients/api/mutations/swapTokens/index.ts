import { VError } from 'errors';
import { ContractTransaction } from 'ethers';
import { SwapRouter } from 'packages/contracts';
import { Swap } from 'types';
import { generateTransactionDeadline } from 'utilities';

export interface SwapTokensInput {
  swapRouterContract: SwapRouter;
  swap: Swap;
}

export type SwapTokensOutput = ContractTransaction;

const swapTokens = async ({
  swapRouterContract,
  swap,
}: SwapTokensInput): Promise<SwapTokensOutput> => {
  const transactionDeadline = generateTransactionDeadline();
  const fromAccountAddress = await swapRouterContract.signer.getAddress();

  // Sell fromTokens for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapExactTokensForTokens(
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
    );
  }

  // Sell BNBs for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapExactBNBForTokens(
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
      { value: swap.fromTokenAmountSoldWei.toFixed() },
    );
  }

  // Sell fromTokens for as many BNBs as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return swapRouterContract.swapExactTokensForBNB(
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
    );
  }

  // Buy toTokens by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapTokensForExactTokens(
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
    );
  }

  // Buy toTokens by selling as few BNBs as possible
  if (swap.direction === 'exactAmountOut' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapBNBForExactTokens(
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
      { value: swap.maximumFromTokenAmountSoldWei.toFixed() },
    );
  }

  // Buy BNBs by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return swapRouterContract.swapTokensForExactBNB(
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      fromAccountAddress,
      transactionDeadline,
    );
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokens;
