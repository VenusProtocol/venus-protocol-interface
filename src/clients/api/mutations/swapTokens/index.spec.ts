import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import fakeTransactionReceipt from '__mocks__/models/transactionReceipt';
import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';
import { PancakeRouter } from 'types/contracts';

import swapTokens from '.';

const fakeExactAmountInSwap: ExactAmountInSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.cake,
  fromTokenAmountSoldWei: new BigNumber('10000000000000000'),
  toToken: PANCAKE_SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: new BigNumber('20000000000000000'),
  expectedToTokenAmountReceivedWei: new BigNumber('30000000000000000'),
  direction: 'exactAmountIn',
  routePath: [PANCAKE_SWAP_TOKENS.cake.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

const fakeExactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.cake,
  expectedFromTokenAmountSoldWei: new BigNumber('20000000000000000'),
  maximumFromTokenAmountSoldWei: new BigNumber('30000000000000000'),
  toToken: PANCAKE_SWAP_TOKENS.busd,
  toTokenAmountReceivedWei: new BigNumber('10000000000000000'),
  direction: 'exactAmountOut',
  routePath: [PANCAKE_SWAP_TOKENS.cake.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

describe('api/mutation/swapTokens', () => {
  it('throws an error when request fails', async () => {
    const fakeContract = {
      methods: {
        swapExactTokensForTokens: () => ({
          send: async () => {
            throw new Error('Fake error message');
          },
        }),
      },
    } as unknown as PancakeRouter;

    try {
      await swapTokens({
        pancakeRouterContract: fakeContract,
        swap: fakeExactAmountInSwap,
        fromAccountAddress: fakeAccountAddress,
      });

      throw new Error('swapTokens should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  it('throws an error when input is incorrect', async () => {
    const fakeContract = {} as unknown as PancakeRouter;

    try {
      await swapTokens({
        pancakeRouterContract: fakeContract,
        swap: {} as unknown as ExactAmountInSwap,
        fromAccountAddress: fakeAccountAddress,
      });

      throw new Error('swapTokens should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: incorrectSwapInput]');
    }
  });

  it('calls the right contract method when selling an exact amount of non-native tokens for as many non-native tokens as possible', async () => {
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const swapExactTokensForTokensMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        swapExactTokensForTokens: swapExactTokensForTokensMock,
      },
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: fakeExactAmountInSwap,
      fromAccountAddress: fakeAccountAddress,
    });

    expect(swapExactTokensForTokensMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForTokensMock).toHaveBeenCalledWith(
      fakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      fakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      fakeExactAmountInSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
  });

  it('calls the right contract method when selling an exact amount of native tokens for as many non-native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      fromToken: PANCAKE_SWAP_TOKENS.bnb,
      routePath: [PANCAKE_SWAP_TOKENS.bnb.address, PANCAKE_SWAP_TOKENS.busd.address],
    };

    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const swapExactETHForTokensMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        swapExactETHForTokens: swapExactETHForTokensMock,
      },
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      fromAccountAddress: fakeAccountAddress,
    });

    expect(swapExactETHForTokensMock).toHaveBeenCalledTimes(1);
    expect(swapExactETHForTokensMock).toHaveBeenCalledWith(
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountInSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: fakeAccountAddress,
      value: customFakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
    });
  });

  it('calls the right contract method when selling an exact amount of non-native tokens for as many native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      toToken: PANCAKE_SWAP_TOKENS.bnb,
      routePath: [PANCAKE_SWAP_TOKENS.busd.address, PANCAKE_SWAP_TOKENS.bnb.address],
    };

    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const swapExactTokensForETHMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        swapExactTokensForETH: swapExactTokensForETHMock,
      },
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      fromAccountAddress: fakeAccountAddress,
    });

    expect(swapExactTokensForETHMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForETHMock).toHaveBeenCalledWith(
      customFakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountInSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
  });

  it('calls the right contract method when buying an exact amount of non-native tokens for as few non-native tokens as possible', async () => {
    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const swapTokensForExactTokensMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        swapTokensForExactTokens: swapTokensForExactTokensMock,
      },
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: fakeExactAmountOutSwap,
      fromAccountAddress: fakeAccountAddress,
    });

    expect(swapTokensForExactTokensMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactTokensMock).toHaveBeenCalledWith(
      fakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      fakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      fakeExactAmountOutSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({ from: fakeAccountAddress });
  });

  it('calls the right contract method when buying an exact amount of non-native tokens for as few native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      fromToken: PANCAKE_SWAP_TOKENS.bnb,
      routePath: [PANCAKE_SWAP_TOKENS.bnb.address, PANCAKE_SWAP_TOKENS.busd.address],
    };

    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const swapETHForExactTokensMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        swapETHForExactTokens: swapETHForExactTokensMock,
      },
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      fromAccountAddress: fakeAccountAddress,
    });

    expect(swapETHForExactTokensMock).toHaveBeenCalledTimes(1);
    expect(swapETHForExactTokensMock).toHaveBeenCalledWith(
      customFakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: fakeAccountAddress,
      value: customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
    });
  });

  it('calls the right contract method when buying an exact amount of native tokens for as few non-native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      toToken: PANCAKE_SWAP_TOKENS.bnb,
      routePath: [PANCAKE_SWAP_TOKENS.busd.address, PANCAKE_SWAP_TOKENS.bnb.address],
    };

    const sendMock = jest.fn(async () => fakeTransactionReceipt);
    const swapTokensForExactETHMock = jest.fn(() => ({
      send: sendMock,
    }));

    const fakeContract = {
      methods: {
        swapTokensForExactETH: swapTokensForExactETHMock,
      },
    } as unknown as PancakeRouter;

    await swapTokens({
      pancakeRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      fromAccountAddress: fakeAccountAddress,
    });

    expect(swapTokensForExactETHMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactETHMock).toHaveBeenCalledWith(
      customFakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      fakeAccountAddress,
      expect.any(Number),
    );

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith({
      from: fakeAccountAddress,
    });
  });
});
