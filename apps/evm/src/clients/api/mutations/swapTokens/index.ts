import type { SwapRouter } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { LooseEthersContractTxData, Swap } from 'types';
import { generateTransactionDeadline } from 'utilities';

export interface SwapTokensInput {
  swapRouterContract: SwapRouter;
  swap: Swap;
}

export type SwapTokensOutput = LooseEthersContractTxData;

const swapTokens = async ({
  swapRouterContract,
  swap,
}: SwapTokensInput): Promise<SwapTokensOutput> => {
  const transactionDeadline = generateTransactionDeadline();
  const fromAccountAddress = await swapRouterContract.signer.getAddress();

  // Sell fromTokens for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapExactTokensForTokens',
      args: [
        swap.fromTokenAmountSoldMantissa.toFixed(),
        swap.minimumToTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      ],
    };
  }

  // Sell BNBs for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapExactBNBForTokens',
      args: [
        swap.minimumToTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      ],
      overrides: { value: swap.fromTokenAmountSoldMantissa.toFixed() },
    };
  }

  // Sell fromTokens for as many BNBs as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapExactTokensForBNB',
      args: [
        swap.fromTokenAmountSoldMantissa.toFixed(),
        swap.minimumToTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      ],
    };
  }

  // Buy toTokens by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapTokensForExactTokens',
      args: [
        swap.toTokenAmountReceivedMantissa.toFixed(),
        swap.maximumFromTokenAmountSoldMantissa.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      ],
    };
  }

  // Buy toTokens by selling as few BNBs as possible
  if (swap.direction === 'exactAmountOut' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapBNBForExactTokens',
      args: [
        swap.toTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      ],
      overrides: { value: swap.maximumFromTokenAmountSoldMantissa.toFixed() },
    };
  }

  // Buy BNBs by selling as few fromTokens as possible
  if (swap.direction === 'exactAmountOut' && !swap.fromToken.isNative && swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapTokensForExactBNB',
      args: [
        swap.toTokenAmountReceivedMantissa.toFixed(),
        swap.maximumFromTokenAmountSoldMantissa.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      ],
    };
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokens;
