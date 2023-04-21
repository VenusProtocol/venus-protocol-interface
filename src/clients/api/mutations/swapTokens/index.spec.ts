import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner, { signerAddress as fakeSignerAddress } from '__mocks__/models/signer';
import { SWAP_TOKENS } from 'constants/tokens';
import { PancakeRouter } from 'types/contracts';

import swapTokens from '.';

const fakeExactAmountInSwap: ExactAmountInSwap = {
  fromToken: SWAP_TOKENS.cake,
  fromTokenAmountSoldWei: new BigNumber('10000000000000000'),
  toToken: SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: new BigNumber('20000000000000000'),
  expectedToTokenAmountReceivedWei: new BigNumber('30000000000000000'),
  direction: 'exactAmountIn',
  routePath: [SWAP_TOKENS.cake.address, SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

const fakeExactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: SWAP_TOKENS.cake,
  expectedFromTokenAmountSoldWei: new BigNumber('20000000000000000'),
  maximumFromTokenAmountSoldWei: new BigNumber('30000000000000000'),
  toToken: SWAP_TOKENS.busd,
  toTokenAmountReceivedWei: new BigNumber('10000000000000000'),
  direction: 'exactAmountOut',
  routePath: [SWAP_TOKENS.cake.address, SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

describe('api/mutation/swapTokens', () => {
  it('calls the right contract method when selling an exact amount of non-native tokens for as many non-native tokens as possible', async () => {
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const swapExactTokensForTokensMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactTokensForTokens: swapExactTokensForTokensMock,
      signer: fakeSigner,
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
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
      fromToken: SWAP_TOKENS.bnb,
      routePath: [SWAP_TOKENS.bnb.address, SWAP_TOKENS.busd.address],
    };

    const waitMock = jest.fn(async () => fakeContractReceipt);
    const swapExactETHForTokensMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactETHForTokens: swapExactETHForTokensMock,
      signer: fakeSigner,
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
    });

    expect(swapExactETHForTokensMock).toHaveBeenCalledTimes(1);
    expect(swapExactETHForTokensMock).toHaveBeenCalledWith(
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
      toToken: SWAP_TOKENS.bnb,
      routePath: [SWAP_TOKENS.busd.address, SWAP_TOKENS.bnb.address],
    };

    const waitMock = jest.fn(async () => fakeContractReceipt);
    const swapExactTokensForETHMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactTokensForETH: swapExactTokensForETHMock,
      signer: fakeSigner,
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
    });

    expect(swapExactTokensForETHMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForETHMock).toHaveBeenCalledWith(
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
    const waitMock = jest.fn(async () => fakeContractReceipt);
    const swapTokensForExactTokensMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapTokensForExactTokens: swapTokensForExactTokensMock,
      signer: fakeSigner,
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
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
      fromToken: SWAP_TOKENS.bnb,
      routePath: [SWAP_TOKENS.bnb.address, SWAP_TOKENS.busd.address],
    };

    const waitMock = jest.fn(async () => fakeContractReceipt);
    const swapETHForExactTokensMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapETHForExactTokens: swapETHForExactTokensMock,
      signer: fakeSigner,
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
    });

    expect(swapETHForExactTokensMock).toHaveBeenCalledTimes(1);
    expect(swapETHForExactTokensMock).toHaveBeenCalledWith(
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
      toToken: SWAP_TOKENS.bnb,
      routePath: [SWAP_TOKENS.busd.address, SWAP_TOKENS.bnb.address],
    };

    const waitMock = jest.fn(async () => fakeContractReceipt);
    const swapTokensForExactETHMock = jest.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapTokensForExactETH: swapTokensForExactETHMock,
      signer: fakeSigner,
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
    });

    expect(swapTokensForExactETHMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactETHMock).toHaveBeenCalledWith(
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
