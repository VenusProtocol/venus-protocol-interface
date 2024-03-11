import type { ContractTransaction } from 'ethers';

import type { SwapRouter } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { Swap, VToken } from 'types';
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
      swap.fromTokenAmountSoldMantissa.toFixed(),
      swap.minimumToTokenAmountReceivedMantissa.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
  }

  // Sell BNBs to supply as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return swapRouterContract.swapExactBNBForTokensAndSupply(
      vToken.address,
      swap.minimumToTokenAmountReceivedMantissa.toFixed(),
      swap.routePath,
      transactionDeadline,
      { value: swap.fromTokenAmountSoldMantissa.toFixed() },
    );
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokensAndSupply;
