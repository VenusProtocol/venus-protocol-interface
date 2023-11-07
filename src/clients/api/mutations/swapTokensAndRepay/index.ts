import { VError } from 'errors';
import { ContractTransaction } from 'ethers';
import { SwapRouter } from 'packages/contracts';
import { Swap, VToken } from 'types';
import { generateTransactionDeadline } from 'utilities';

export interface SwapTokensAndRepayInput {
  swapRouterContract: SwapRouter;
  swap: Swap;
  vToken: VToken;
  isRepayingFullLoan: boolean;
}

export type SwapTokensAndRepayOutput = ContractTransaction;

const swapTokensAndRepay = async ({
  swapRouterContract,
  swap,
  vToken,
  isRepayingFullLoan = false,
}: SwapTokensAndRepayInput): Promise<SwapTokensAndRepayOutput> => {
  const transactionDeadline = generateTransactionDeadline();

  // Repay full loan in tokens using tokens
  if (
    isRepayingFullLoan &&
    swap.direction === 'exactAmountOut' &&
    !swap.fromToken.isNative &&
    !swap.toToken.isNative
  ) {
    return swapRouterContract.swapTokensForFullTokenDebtAndRepay(
      vToken.address,
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
  }

  // Repay full loan in BNBs using tokens
  if (
    isRepayingFullLoan &&
    swap.direction === 'exactAmountOut' &&
    !swap.fromToken.isNative &&
    swap.toToken.isNative
  ) {
    return swapRouterContract.swapTokensForFullBNBDebtAndRepay(
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
  }

  // Repay full loan in tokens using BNBs
  if (
    isRepayingFullLoan &&
    swap.direction === 'exactAmountOut' &&
    swap.fromToken.isNative &&
    !swap.toToken.isNative
  ) {
    return swapRouterContract.swapBNBForFullTokenDebtAndRepay(
      vToken.address,
      swap.routePath,
      transactionDeadline,
      {
        value: swap.maximumFromTokenAmountSoldWei.toFixed(),
      },
    );
  }

  // Sell fromTokens to repay as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapExactTokensForTokensAndRepay(
      vToken.address,
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
  }

  // Sell BNBs to repay as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapBNBForExactTokensAndRepay(
      vToken.address,
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
      { value: swap.fromTokenAmountSoldWei.toFixed() },
    );
  }

  // Sell fromTokens to repay as many BNBs as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return swapRouterContract.swapExactTokensForBNBAndRepay(
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
  }

  // Repay toTokens by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapTokensForExactTokensAndRepay(
      vToken.address,
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
  }

  // Repay toTokens by selling as few BNBs as possible
  if (swap.direction === 'exactAmountOut' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapBNBForExactTokensAndRepay(
      vToken.address,
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
      { value: swap.maximumFromTokenAmountSoldWei.toFixed() },
    );
  }

  // Repay BNBs by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return swapRouterContract.swapTokensForExactBNBAndRepay(
      swap.toTokenAmountReceivedWei.toFixed(),
      swap.maximumFromTokenAmountSoldWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokensAndRepay;
