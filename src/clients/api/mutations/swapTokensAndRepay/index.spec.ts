import { ContractTypeByName } from 'packages/contracts';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import { assetData } from '__mocks__/models/asset';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeSigner from '__mocks__/models/signer';
import {
  exactAmountInSwap as fakeExactAmountInSwap,
  exactAmountOutSwap as fakeExactAmountOutSwap,
} from '__mocks__/models/swaps';
import { bnb, busd } from '__mocks__/models/tokens';

import swapTokens from '.';

const fakeVToken = assetData[0].vToken;

describe('api/mutation/swapTokensAndRepay', () => {
  it('calls the right contract method when repaying a full loan in non-native tokens by selling as few non-native tokens as possible', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapTokensForFullTokenDebtAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapTokensForFullTokenDebtAndRepay: swapTokensForFullTokenDebtAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: true,
    });

    expect(swapTokensForFullTokenDebtAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForFullTokenDebtAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      fakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      fakeExactAmountOutSwap.routePath,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when repaying a full loan in native tokens by selling as few non-native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapTokensForFullBNBDebtAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapTokensForFullBNBDebtAndRepay: swapTokensForFullBNBDebtAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: true,
    });

    expect(swapTokensForFullBNBDebtAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForFullBNBDebtAndRepayMock).toHaveBeenCalledWith(
      customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when repaying a full loan in non-native tokens by selling as few native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapBNBForFullTokenDebtAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapBNBForFullTokenDebtAndRepay: swapBNBForFullTokenDebtAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: true,
    });

    expect(swapBNBForFullTokenDebtAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapBNBForFullTokenDebtAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      customFakeExactAmountOutSwap.routePath,
      expect.any(Number),
      {
        value: customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      },
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when selling an exact amount of non-native tokens to repay as many non-native tokens as possible', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapExactTokensForTokensAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactTokensForTokensAndRepay: swapExactTokensForTokensAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountInSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(swapExactTokensForTokensAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForTokensAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      fakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      fakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      fakeExactAmountInSwap.routePath,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when selling an exact amount of native tokens to repay as many non-native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapBNBForExactTokensAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapBNBForExactTokensAndRepay: swapBNBForExactTokensAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

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
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when selling an exact amount of non-native tokens to repay as many native tokens as possible', async () => {
    const customFakeExactAmountInSwap: ExactAmountInSwap = {
      ...fakeExactAmountInSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapExactTokensForBNBAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapExactTokensForBNBAndRepay: swapExactTokensForBNBAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountInSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(swapExactTokensForBNBAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapExactTokensForBNBAndRepayMock).toHaveBeenCalledWith(
      customFakeExactAmountInSwap.fromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountInSwap.minimumToTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountInSwap.routePath,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when repaying an exact amount of non-native tokens by selling as few non-native tokens as possible', async () => {
    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapTokensForExactTokensAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapTokensForExactTokensAndRepay: swapTokensForExactTokensAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: fakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(swapTokensForExactTokensAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactTokensAndRepayMock).toHaveBeenCalledWith(
      fakeVToken.address,
      fakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      fakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      fakeExactAmountOutSwap.routePath,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when repaying an exact amount of non-native tokens by selling as few native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      fromToken: bnb,
      routePath: [bnb.address, busd.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapBNBForExactTokensAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapBNBForExactTokensAndRepay: swapBNBForExactTokensAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

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
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });

  it('calls the right contract method when repaying an exact amount of native tokens by selling as few non-native tokens as possible', async () => {
    const customFakeExactAmountOutSwap: ExactAmountOutSwap = {
      ...fakeExactAmountOutSwap,
      toToken: bnb,
      routePath: [busd.address, bnb.address],
    };

    const waitMock = vi.fn(async () => fakeContractReceipt);
    const swapTokensForExactBNBAndRepayMock = vi.fn(() => ({
      wait: waitMock,
    }));

    const fakeContract = {
      swapTokensForExactBNBAndRepay: swapTokensForExactBNBAndRepayMock,
      signer: fakeSigner,
    } as unknown as ContractTypeByName<'swapRouter'>;

    await swapTokens({
      swapRouterContract: fakeContract,
      swap: customFakeExactAmountOutSwap,
      vToken: fakeVToken,
      isRepayingFullLoan: false,
    });

    expect(swapTokensForExactBNBAndRepayMock).toHaveBeenCalledTimes(1);
    expect(swapTokensForExactBNBAndRepayMock).toHaveBeenCalledWith(
      customFakeExactAmountOutSwap.toTokenAmountReceivedWei.toFixed(),
      customFakeExactAmountOutSwap.maximumFromTokenAmountSoldWei.toFixed(),
      customFakeExactAmountOutSwap.routePath,
      expect.any(Number),
    );
    expect(waitMock).toBeCalledTimes(1);
    expect(waitMock).toHaveBeenCalledWith(1);
  });
});
