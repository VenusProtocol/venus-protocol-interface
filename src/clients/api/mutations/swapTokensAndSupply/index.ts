import { VError } from 'errors';
import { ContractTransaction } from 'ethers';
import { SwapRouter } from 'packages/contracts';
import { Swap, VToken } from 'types';
import { generateTransactionDeadline } from 'utilities';

export interface SwapTokensAndSupplyInput {
  swapRouterContract: SwapRouter;
  swap: Swap;
  vToken: VToken;
}

export type SwapTokensAndSupplyOutput = ContractTransaction;

const swapTokensAndSupply = async ({
  swapRouterContract,
  swap,
  vToken,
}: SwapTokensAndSupplyInput): Promise<SwapTokensAndSupplyOutput> => {
  const transactionDeadline = generateTransactionDeadline();
  // Sell fromTokens to supply as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapExactTokensForTokensAndSupply(
      vToken.address,
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
  }

  // Sell BNBs to supply as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapExactBNBForTokensAndSupply(
      vToken.address,
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
      { value: swap.fromTokenAmountSoldWei.toFixed() },
    );
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokensAndSupply;
