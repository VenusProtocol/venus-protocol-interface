import { SwapRouter } from 'packages/contracts';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import { assetData } from '__mocks__/models/asset';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import fakeSigner from '__mocks__/models/signer';
import {
  exactAmountInSwap as fakeExactAmountInSwap,
  exactAmountOutSwap as fakeExactAmountOutSwap,
} from '__mocks__/models/swaps';
import { bnb, busd } from '__mocks__/models/tokens';

import swapTokens from '.';

const fakeVToken = assetData[0].vToken;

describe('swapTokensAndRepay', () => {
  it('calls the right contract method when repaying a full loan in non-native tokens by selling as few non-native tokens as possible', async () => {
    const swapTokensForFullTokenDebtAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapTokensForFullTokenDebtAndRepay: swapTokensForFullTokenDebtAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: true,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapTokensForFullTokenDebtAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForFullTokenDebtAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      fakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      fakeExactAmountOutSwap.routePath,
      expect.any(Number),
    );
  });

  it('calls the right contract method when repaying a full loan in native tokens by selling as few non-native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const swapTokensForFullBNBDebtAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapTokensForFullBNBDebtAndRepay: swapTokensForFullBNBDebtAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: true,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapTokensForFullBNBDebtAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForFullBNBDebtAndRepayMock).toHaveBeenCalledWith(
      customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      expect.any(Number),
    );
  });

  it('calls the right contract method when repaying a full loan in non-native tokens by selling as few native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const swapBNBForFullTokenDebtAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapBNBForFullTokenDebtAndRepay: swapBNBForFullTokenDebtAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: true,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapBNBForFullTokenDebtAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapBNBForFullTokenDebtAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      customFakeExactAmountOutSwap.routePath,
      expect.any(Number),
      {
        value: customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      },
    );
  });

  it('calls the right contract method when selling an exact amount of non-native tokens to repay as many non-native tokens as possible', async () => {
    const swapExactTokensForTokensAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapExactTokensForTokensAndRepay: swapExactTokensForTokensAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountInSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapExactTokensForTokensAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForTokensAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      fakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      fakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      fakeExactAmountInSwap.routePath,
      expect.any(Number),
    );
  });

  it('calls the right contract method when selling an exact amount of native tokens to repay as many non-native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const swapBNBForExactTokensAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapBNBForExactTokensAndRepay: swapBNBForExactTokensAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapBNBForExactTokensAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapBNBForExactTokensAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountInSwap.routePath,
      expect.any(Number),
      {
        value: customFakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      },
    );
  });

  it('calls the right contract method when selling an exact amount of non-native tokens to repay as many native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const swapExactTokensForBNBAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapExactTokensForBNBAndRepay: swapExactTokensForBNBAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapExactTokensForBNBAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForBNBAndRepayMock).toHaveBeenCalledWith(
      customFakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountInSwap.routePath,
      expect.any(Number),
    );
  });

  it('calls the right contract method when repaying an exact amount of non-native tokens by selling as few non-native tokens as possible', async () => {
    const swapTokensForExactTokensAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapTokensForExactTokensAndRepay: swapTokensForExactTokensAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapTokensForExactTokensAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactTokensAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      fakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      fakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      fakeExactAmountOutSwap.routePath,
      expect.any(Number),
    );
  });

  it('calls the right contract method when repaying an exact amount of non-native tokens by selling as few native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const swapBNBForExactTokensAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapBNBForExactTokensAndRepay: swapBNBForExactTokensAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapBNBForExactTokensAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapBNBForExactTokensAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      customFakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      expect.any(Number),
      {
        value: customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      },
    );
  });

  it('calls the right contract method when repaying an exact amount of native tokens by selling as few non-native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const swapTokensForExactBNBAndRepayMock = vi.fn(async () => fakeContractTransaction);

    const fakeContract = {
      swapTokensForExactBNBAndRepay: swapTokensForExactBNBAndRepayMock,
      signer: fakeSigner,
    } as unknown as SwapRouter;

    const result = await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(result).toBe(fakeContractTransaction);
    expect(swapTokensForExactBNBAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactBNBAndRepayMock).toHaveBeenCalledWith(
      customFakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      expect.any(Number),
    );
  });
});
