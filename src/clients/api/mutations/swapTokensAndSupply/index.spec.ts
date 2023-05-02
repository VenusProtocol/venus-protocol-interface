import { ExactAmountInSwap } from 'types';

import { assetData } from '__mocks__/models/asset';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner from '__mocks__/models/signer';
import { exactAmountInSwap as fakeExactAmountInSwap } from '__mocks__/models/swaps';
import { SWAP_TOKENS } from 'constants/tokens';
import { SwapRouter } from 'types/contracts';

import swapTokens from '.';

const fakeVToken = assetData[0].vToken;

describe('api/mutation/swapTokensAndSupply', () => {
  it('calls the right contract method when selling an exact amount of non-native tokens to supply as many non-native tokens as possible', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const swapExactTokensForTokensAndSupplyMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactTokensForTokensAndSupply: swapExactTokensForTokensAndSupplyMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountInSwap,
      vToken: fakeVToken,
    });

    expect(swapExactTokensForTokensAndSupplyMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForTokensAndSupplyMock).toHaveBeenCalledWith(
      fakeVToken.address,
      fakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      fakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      fakeExactAmountInSwap.routePath,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when selling an exact amount of native tokens to supply as many non-native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      fromToken: SWAP_TOKENS.bnb,
      routePath: [SWAP_TOKENS.bnb.address, SWAP_TOKENS.busd.address],
    };

    const waitMock = jest.fn(async () => fakeContractReceipt);
    const swapExactBNBForTokensAndSupplyMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactBNBForTokensAndSupply: swapExactBNBForTokensAndSupplyMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      vToken: fakeVToken,
    });

    expect(swapExactBNBForTokensAndSupplyMock).toHaveBeenCalledTimes(1);
    expect(swapExactBNBForTokensAndSupplyMock).toHaveBeenCalledWith(
      fakeVToken.address,
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountInSwap.routePath,
      expect.any(Number),
      {
        value: customFakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      },
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
