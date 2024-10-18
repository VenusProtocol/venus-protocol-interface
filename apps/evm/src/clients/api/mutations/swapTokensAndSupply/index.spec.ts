import { assetData } from '__mocks__/models/asset';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import { exactAmountInSwap as fakeExactAmountInSwap } from '__mocks__/models/swaps';
import { bnb, busd } from '__mocks__/models/tokens';

import type { SwapRouter } from 'libs/contracts';
import type { ExactAmountInSwap } from 'types';

import swapTokensAndSupply from '.';

const fakeVToken = assetData[0].vToken;

describe('swapTokensAndSupplyAndSupply', () => {
  it('calls the right contract method when selling an exact amount of non-native tokens to supply as many non-native tokens as possible', async () => {
    const swapExactTokensForTokensAndSupplyMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapExactTokensForTokensAndSupply: swapExactTokensForTokensAndSupplyMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = swapTokensAndSupply({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountInSwap,
      vToken: fakeVToken,
    });

    expect(result).toStrictEqual({
      contract: fakeContract,
      args: [
        fakeVToken.address,
        fakeExactAmountInSwap.fromTokenAmountSoldMantissa.toFixed(),
        fakeExactAmountInSwap.minimumToTokenAmountReceivedMantissa.toFixed(),
        fakeExactAmountInSwap.routePath,
        expect.any(Number),
      ],
      methodName: 'swapExactTokensForTokensAndSupply',
    });
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

    const result = swapTokensAndSupply({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      vToken: fakeVToken,
    });

    expect(result).toStrictEqual({
      contract: fakeContract,
      args: [
        fakeVToken.address,
        customFakeExactAmountInSwap.minimumToTokenAmountReceivedMantissa.toFixed(),
        customFakeExactAmountInSwap.routePath,
        expect.any(Number),
      ],
      overrides: {
        value: customFakeExactAmountInSwap.fromTokenAmountSoldMantissa.toFixed(),
      },
      methodName: 'swapExactBNBForTokensAndSupply',
    });
  });
});
