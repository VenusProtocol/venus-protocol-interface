import type { Signer } from 'libs/wallet';
import type { Swap } from 'types';

export const swapTokens = ({
  signer,
  swap,
  zeroXExchangeContractAddress,
}: {
  signer: Signer;
  swap: Swap;
  zeroXExchangeContractAddress: string;
}) =>
  signer.sendTransaction({
    to: zeroXExchangeContractAddress,
    data: swap.transactionData,
    value:
      // Add value to transaction when swapping native currency
      swap.direction === 'exactAmountIn' && swap.fromToken.isNative
        ? swap.fromTokenAmountSoldMantissa.toFixed()
        : undefined,
  });
