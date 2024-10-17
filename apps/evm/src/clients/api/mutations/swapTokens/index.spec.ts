import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import {
  exactAmountInSwap as fakeExactAmountInSwap,
  exactAmountOutSwap as fakeExactAmountOutSwap,
} from '__mocks__/models/swaps';
import { bnb, busd } from '__mocks__/models/tokens';

import type { SwapRouter } from 'libs/contracts';
import type { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import swapTokens from '.';

describe('swapTokens', () => {
  it('calls the right contract method when selling an exact amount of non-native tokens for as many non-native tokens as possible', async () => {
    const swapExactTokensForTokensMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapExactTokensForTokens: swapExactTokensForTokensMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountInSwap,
    });

    expect(result).toStrictEqual({
      contract: fakeContract,
      args: [
        fakeExactAmountInSwap.fromTokenAmountSoldMantissa.toFixed(),
        fakeExactAmountInSwap.minimumToTokenAmountReceivedMantissa.toFixed(),
        fakeExactAmountInSwap.routePath,
        fakeSignerAddress,
        expect.any(Number),
      ],
      methodName: 'swapExactTokensForTokens',
    });
  });

  it('calls the right contract method when selling an exact amount of native tokens for as many non-native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const swapExactBNBForTokensMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapExactBNBForTokens: swapExactBNBForTokensMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
    });

    expect(result).toStrictEqual({
      contract: fakeContract,
      args: [
        customFakeExactAmountInSwap.minimumToTokenAmountReceivedMantissa.toFixed(),
        customFakeExactAmountInSwap.routePath,
        fakeAccountAddress,
        expect.any(Number),
      ],
      overrides: {
        value: customFakeExactAmountInSwap.fromTokenAmountSoldMantissa.toFixed(),
      },
      methodName: 'swapExactBNBForTokens',
    });
  });

  it('calls the right contract method when selling an exact amount of non-native tokens for as many native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const swapExactTokensForBNBMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapExactTokensForBNB: swapExactTokensForBNBMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
    });

    expect(result).toStrictEqual({
      contract: fakeContract,
      args: [
        customFakeExactAmountInSwap.fromTokenAmountSoldMantissa.toFixed(),
        customFakeExactAmountInSwap.minimumToTokenAmountReceivedMantissa.toFixed(),
        customFakeExactAmountInSwap.routePath,
        fakeAccountAddress,
        expect.any(Number),
      ],
      methodName: 'swapExactTokensForBNB',
    });
  });

  it('calls the right contract method when buying an exact amount of non-native tokens for as few non-native tokens as possible', async () => {
    const swapTokensForExactTokensMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapTokensForExactTokens: swapTokensForExactTokensMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountOutSwap,
    });

    expect(result).toStrictEqual({
      contract: fakeContract,
      args: [
        fakeExactAmountOutSwap.toTokenAmountReceivedMantissa.toFixed(),
        fakeExactAmountOutSwap.maximumFromTokenAmountSoldMantissa.toFixed(),
        fakeExactAmountOutSwap.routePath,
        fakeAccountAddress,
        expect.any(Number),
      ],
      methodName: 'swapTokensForExactTokens',
    });
  });

  it('calls the right contract method when buying an exact amount of non-native tokens for as few native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const swapBNBForExactTokensMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapBNBForExactTokens: swapBNBForExactTokensMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
    });

    expect(result).toStrictEqual({
      contract: fakeContract,
      args: [
        customFakeExactAmountOutSwap.toTokenAmountReceivedMantissa.toFixed(),
        customFakeExactAmountOutSwap.routePath,
        fakeAccountAddress,
        expect.any(Number),
      ],
      overrides: {
        value: customFakeExactAmountOutSwap.maximumFromTokenAmountSoldMantissa.toFixed(),
      },
      methodName: 'swapBNBForExactTokens',
    });
  });

  it('calls the right contract method when buying an exact amount of native tokens for as few non-native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const swapTokensForExactBNBMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapTokensForExactBNB: swapTokensForExactBNBMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
    });

    expect(result).toStrictEqual({
      contract: fakeContract,
      args: [
        customFakeExactAmountOutSwap.toTokenAmountReceivedMantissa.toFixed(),
        customFakeExactAmountOutSwap.maximumFromTokenAmountSoldMantissa.toFixed(),
        customFakeExactAmountOutSwap.routePath,
        fakeAccountAddress,
        expect.any(Number),
      ],
      methodName: 'swapTokensForExactBNB',
    });
  });
});
