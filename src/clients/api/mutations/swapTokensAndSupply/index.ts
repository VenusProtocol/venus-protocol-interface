import { VError } from 'errors';
import { ContractReceipt } from 'ethers';
import { SwapRouter } from 'packages/contractsNew';
import { Swap, VToken } from 'types';
import { generateTransactionDeadline } from 'utilities';

export interface SwapTokensAndSupplyInput {
  swapRouterContract: SwapRouter;
  swap: Swap;
  vToken: VToken;
}

export type SwapTokensAndSupplyOutput = ContractReceipt;

const swapTokensAndSupply = async ({
  swapRouterContract,
  swap,
  vToken,
}: SwapTokensAndSupplyInput): Promise<SwapTokensAndSupplyOutput> => {
  const transactionDeadline = generateTransactionDeadline();
  // Sell fromTokens to supply as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapExactTokensForTokensAndSupply(
      vToken.address,
      swap.fromTokenAmountSoldWei.toFixed(),
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
    );
    return transaction.wait(1);
  }

  // Sell BNBs to supply as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    const transaction = await swapRouterContract.swapExactBNBForTokensAndSupply(
      vToken.address,
      swap.minimumToTokenAmountReceivedWei.toFixed(),
      swap.routePath,
      transactionDeadline,
      { value: swap.fromTokenAmountSoldWei.toFixed() },
    );
    return transaction.wait(1);
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokensAndSupply;
