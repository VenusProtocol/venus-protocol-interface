import type { SwapRouter } from 'libs/contracts';
import { VError } from 'libs/errors';
import type { LooseEthersContractTxData, Swap, VToken } from 'types';
import { generateTransactionDeadline } from 'utilities';

export interface SwapTokensAndSupplyInput {
  swapRouterContract: SwapRouter;
  swap: Swap;
  vToken: VToken;
}

export type SwapTokensAndSupplyOutput = LooseEthersContractTxData;

const swapTokensAndSupply = ({
  swapRouterContract,
  swap,
  vToken,
}: SwapTokensAndSupplyInput): SwapTokensAndSupplyOutput => {
  const transactionDeadline = generateTransactionDeadline();
  // Sell fromTokens to supply as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapExactTokensForTokensAndSupply',
      args: [
        vToken.address,
        swap.fromTokenAmountSoldMantissa.toFixed(),
        swap.minimumToTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
    };
  }

  // Sell BNBs to supply as many toTokens as possible
  if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
    return {
      contract: swapRouterContract,
      methodName: 'swapExactBNBForTokensAndSupply',
      args: [
        vToken.address,
        swap.minimumToTokenAmountReceivedMantissa.toFixed(),
        swap.routePath,
        transactionDeadline,
      ],
      overrides: { value: swap.fromTokenAmountSoldMantissa.toFixed() },
    };
  }

  throw new VError({
    type: 'unexpected',
    code: 'incorrectSwapInput',
  });
};

export default swapTokensAndSupply;
