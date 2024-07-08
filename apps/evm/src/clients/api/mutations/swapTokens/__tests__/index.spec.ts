import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { exactAmountInSwap as fakeExactAmountInSwap } from '__mocks__/models/swaps';

import { bnb } from '__mocks__/models/tokens';
import type { Signer } from 'libs/wallet';
import { swapTokens } from '..';

const fakeSigner = {
  sendTransaction: vi.fn(async () => fakeContractTransaction),
} as unknown as Signer;

const fakeTransactionData = 'fake-transaction-data';

describe('swapTokens', () => {
  it('returns contract transaction when request to swap from an ERC20 token succeeds', async () => {
    const result = await swapTokens({
      signer: fakeSigner,
      swap: {
        ...fakeExactAmountInSwap,
        transactionData: fakeTransactionData,
      },
      zeroXExchangeContractAddress: fakeAddress,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(fakeSigner.sendTransaction).toHaveBeenCalledTimes(1);
    expect(fakeSigner.sendTransaction).toHaveBeenCalledWith({
      data: fakeTransactionData,
      to: fakeAddress,
      value: undefined,
    });
  });

  it('returns contract transaction when request to swap from a native token succeeds', async () => {
    const result = await swapTokens({
      signer: fakeSigner,
      swap: {
        ...fakeExactAmountInSwap,
        fromToken: bnb,
        transactionData: fakeTransactionData,
      },
      zeroXExchangeContractAddress: fakeAddress,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(fakeSigner.sendTransaction).toHaveBeenCalledTimes(1);
    expect(fakeSigner.sendTransaction).toHaveBeenCalledWith({
      data: fakeTransactionData,
      to: fakeAddress,
      value: fakeExactAmountInSwap.fromTokenAmountSoldMantissa.toFixed(),
    });
  });
});
