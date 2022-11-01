import { Swap } from 'types';
import type { TransactionReceipt } from 'web3-core';

import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { TOKENS } from 'constants/tokens';
import { PancakeRouter } from 'types/contracts';

export interface SwapTokensInput {
  pancakeRouterContract: PancakeRouter;
  fromAccountAddress: string;
  swap: Swap;
}

export type SwapTokensOutput = TransactionReceipt;

// TODO: add tests

const TRANSACTION_DEADLINE_MS = 60 * 1000 * 10; // 10 minutes

const swapTokens = async ({
  pancakeRouterContract,
  fromAccountAddress,
  swap,
}: SwapTokensInput): Promise<SwapTokensOutput> => {
  const transactionDeadline = new Date().getTime() + TRANSACTION_DEADLINE_MS;

  if (
    swap.direction === 'exactAmountIn' &&
    swap.fromToken.address !== TOKENS.bnb.address &&
    swap.toToken.address !== TOKENS.bnb.address
  ) {
    return pancakeRouterContract.methods
      .swapExactTokensForTokens(
        swap.fromTokenAmountSoldWei.toFixed(),
        swap.minimumToTokenAmountReceivedWei.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      )
      .send({ from: fromAccountAddress });
  }

  if (
    swap.direction === 'exactAmountOut' &&
    swap.fromToken.address !== TOKENS.bnb.address &&
    swap.toToken.address !== TOKENS.bnb.address
  ) {
    return pancakeRouterContract.methods
      .swapTokensForExactTokens(
        swap.toTokenAmountReceivedWei.toFixed(),
        swap.maximumFromTokenAmountSoldWei.toFixed(),
        swap.routePath,
        fromAccountAddress,
        transactionDeadline,
      )
      .send({ from: fromAccountAddress });
  }

  // TODO: handle other cases
  return fakeTransactionReceipt;
};

export default swapTokens;
