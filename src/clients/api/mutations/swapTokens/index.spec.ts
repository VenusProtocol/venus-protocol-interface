import { SwapRouter } from 'packages/contracts';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import {
  exactAmountInSwap as fakeExactAmountInSwap,
  exactAmountOutSwap as fakeExactAmountOutSwap,
} from '__mocks__/models/swaps';
import { bnb, busd } from '__mocks__/models/tokens';

import swapTokens from '.';

describe('api/mutation/swapTokens', () => {
  it('calls the right contract method when selling an exact amount of non-native tokens for as many non-native tokens as possible', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapExactTokensForTokensMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactTokensForTokens: swapExactTokensForTokensMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountInSwap,
    });

    expect(swapExactTokensForTokensMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForTokensMock).toHaveBeenCalledWith(
      fakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      fakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      fakeExactAmountInSwap.routePath,
      fakeSignerAddress,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when selling an exact amount of native tokens for as many non-native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapExactBNBForTokensMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactBNBForTokens: swapExactBNBForTokensMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
    });

    expect(swapExactBNBForTokensMock).toHaveBeenCalledTimes(1);
    expect(swapExactBNBForTokensMock).toHaveBeenCalledWith(
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountInSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
      {
        value: customFakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      },
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when selling an exact amount of non-native tokens for as many native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapExactTokensForBNBMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactTokensForBNB: swapExactTokensForBNBMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
    });

    expect(swapExactTokensForBNBMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForBNBMock).toHaveBeenCalledWith(
      customFakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountInSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when buying an exact amount of non-native tokens for as few non-native tokens as possible', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapTokensForExactTokensMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapTokensForExactTokens: swapTokensForExactTokensMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountOutSwap,
    });

    expect(swapTokensForExactTokensMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactTokensMock).toHaveBeenCalledWith(
      fakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      fakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      fakeExactAmountOutSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when buying an exact amount of non-native tokens for as few native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapBNBForExactTokensMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapBNBForExactTokens: swapBNBForExactTokensMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
    });

    expect(swapBNBForExactTokensMock).toHaveBeenCalledTimes(1);
    expect(swapBNBForExactTokensMock).toHaveBeenCalledWith(
      customFakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
      {
        value: customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      },
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when buying an exact amount of native tokens for as few non-native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapTokensForExactBNBMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapTokensForExactBNB: swapTokensForExactBNBMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
    });

    expect(swapTokensForExactBNBMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactBNBMock).toHaveBeenCalledWith(
      customFakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
