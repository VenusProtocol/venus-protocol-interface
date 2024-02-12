import { assetData } from '__mocks__/models/asset';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { exactAmountInSwap as fakeExactAmountInSwap } from '__mocks__/models/swaps';
import { bnb, busd } from '__mocks__/models/tokens';

import { SwapRouter } from 'packages/contracts';
import { ExactAmountInSwap } from 'types';

import swapTokensAndSupply from '.';

const fakeVToken = assetData[0].vToken;

describe('swapTokensAndSupplyAndSupply', () => {
  it('calls the right contract method when selling an exact amount of non-native tokens to supply as many non-native tokens as possible', async () => {
    const swapExactTokensForTokensAndSupplyMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapExactTokensForTokensAndSupply: swapExactTokensForTokensAndSupplyMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokensAndSupply({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountInSwap,
      vToken: fakeVToken,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapExactTokensForTokensAndSupplyMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForTokensAndSupplyMock).toHaveBeenCalledWith(
      fakeVToken.address,
      fakeExactAmountInSwap.fromTokenAmountSoldMantissa.toFixed(),
      fakeExactAmountInSwap.minimumToTokenAmountReceivedMantissa.toFixed(),
      fakeExactAmountInSwap.routePath,
      expect.any(Number),
    );
  });

  it('calls the right contract method when selling an exact amount of native tokens to supply as many non-native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const swapExactBNBForTokensAndSupplyMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapExactBNBForTokensAndSupply: swapExactBNBForTokensAndSupplyMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokensAndSupply({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      vToken: fakeVToken,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapExactBNBForTokensAndSupplyMock).toHaveBeenCalledTimes(1);
    expect(swapExactBNBForTokensAndSupplyMock).toHaveBeenCalledWith(
      fakeVToken.address,
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedMantissa.toFixed(),
      customFakeExactAmountInSwap.routePath,
      expect.any(Number),
      {
        value: customFakeExactAmountInSwap.fromTokenAmountSoldMantissa.toFixed(),
      },
    );
  });
});
