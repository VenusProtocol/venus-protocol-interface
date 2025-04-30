import type { SwapRouter } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { LooseEthersContractTxData, Swap, VToken } from 'types';
import { generateTransactionDeadline } from 'utilities/generateTransactionDeadline';

export interface SwapTokensAndRepayInput {
  swapRouterContract: SwapRouter;
  swap: Swap;
  vToken: VToken;
  repayFullLoan: boolean;
}

export type SwapTokensAndRepayOutput = LooseEthersContractTxData;

const swapTokensAndRepay = ({
  swapRouterContract,
  swap,
  vToken,
  repayFullLoan = false,
}: SwapTokensAndRepayInput): SwapTokensAndRepayOutput => {
  const transactionDeadline = generateTransactionDeadline();

  // Repay full loan in tokens using tokens
  if (
    repayFullLoan &&
    swap.direction === 'exactAmountOut' &&
    !swap.fromToken.isNative &&
    !swap.toToken.isNative
  ) {
    return {
      contract: swapRouterContract,
      methodName: 'swapTokensForFullTokenDebtAndRepay',
      args: [
        vToken.address,
        swap.maximumFromTokenAmountSoldMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
    };
  }

  // Repay full loan in BNBs using tokens
  if (
    repayFullLoan &&
    swap.direction === 'exactAmountOut' &&
    !swap.fromToken.isNative &&
    swap.toToken.isNative
  ) {
    return {
      contract: swapRouterContract,
      methodName: 'swapTokensForFullBNBDebtAndRepay',
      args: [
        swap.maximumFromTokenAmountSoldMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
    };
  }

  // Repay full loan in tokens using BNBs
  if (
    repayFullLoan &&
    swap.direction === 'exactAmountOut' &&
    swap.fromToken.isNative &&
    !swap.toToken.isNative
  ) {
    return {
      contract: swapRouterContract,
      methodName: 'swapBNBForFullTokenDebtAndRepay',
      args: [vToken.address, swap.routePath, transactionDeadline],
      overrides: {
        value: swap.maximumFromTokenAmountSoldMantissa.toFixed(),
      },
    };
  }

  // Sell fromTokens to repay as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapExactTokensForTokensAndRepay',
      args: [
        vToken.address,
        swap.fromTokenAmountSoldMantissa.toFixed(),
        swap.minimumToTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
    };
  }

  // Sell BNBs to repay as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapBNBForExactTokensAndRepay',
      args: [
        vToken.address,
        swap.minimumToTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
      overrides: { value: swap.fromTokenAmountSoldMantissa.toFixed() },
    };
  }

  // Sell fromTokens to repay as many BNBs as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapExactTokensForBNBAndRepay',
      args: [
        swap.fromTokenAmountSoldMantissa.toFixed(),
        swap.minimumToTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
    };
  }

  // Repay toTokens by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapTokensForExactTokensAndRepay',
      args: [
        vToken.address,
        swap.toTokenAmountReceivedMantissa.toFixed(),
        swap.maximumFromTokenAmountSoldMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
    };
  }

  // Repay toTokens by selling as few BNBs as possible
  if (swap.direction === 'exactAmountOut' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapBNBForExactTokensAndRepay',
      args: [
        vToken.address,
        swap.toTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
      overrides: { value: swap.maximumFromTokenAmountSoldMantissa.toFixed() },
    };
  }

  // Repay BNBs by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapTokensForExactBNBAndRepay',
      args: [
        swap.toTokenAmountReceivedMantissa.toFixed(),
        swap.maximumFromTokenAmountSoldMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
    };
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokensAndRepay;
