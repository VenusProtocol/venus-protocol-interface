import { VError } from 'errors';
import { ContractReceipt } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';
import { Swap } from 'types';
import { generateTransactionDeadline } from 'utilities';

export interface SwapTokensInput {
  swapRouterContract: ContractTypeByName<'swapRouter'>;
  swap: Swap;
}

export type SwapTokensOutput = ContractReceipt;

const swapTokens = async ({
  swapRouterContract,
  swap,
}: SwapTokensInput): Promise<SwapTokensOutput> => {
  const transactionDeadline = generateTransactionDeadline();
  const fromAccountAddress = await swapRouterContract.signer.getAddress();

  // Sell fromTokens for as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapExactTokensForTokens(
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
    const transaction = await swapRouterContract.swapExactBNBForTokens(
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
    const transaction = await swapRouterContract.swapExactTokensForBNB(
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
    const transaction = await swapRouterContract.swapTokensForExactTokens(
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
    const transaction = await swapRouterContract.swapBNBForExactTokens(
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
    const transaction = await swapRouterContract.swapTokensForExactBNB(
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
