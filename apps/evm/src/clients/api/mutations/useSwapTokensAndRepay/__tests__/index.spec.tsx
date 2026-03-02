import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useSwapTokensAndRepay } from '..';

import fakeAccountAddress, {
  altAddress as fakePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import { bnb, xvs } from '__mocks__/models/tokens';
import { vBnb } from '__mocks__/models/vTokens';
import type { SwapQuote } from 'types';

vi.mock('libs/contracts');
vi.mock('utilities/generateTransactionDeadline');

const fakeAmountMantissa = new BigNumber('10000000000000000');

const fakeSwapQuote: SwapQuote = {
  direction: 'exact-in' as const,
  fromToken: xvs,
  toToken: bnb,
  fromTokenAmountSoldMantissa: BigInt(fakeAmountMantissa.toFixed()),
  minimumToTokenAmountReceivedMantissa: BigInt(fakeAmountMantissa.toFixed()),
  expectedToTokenAmountReceivedMantissa: BigInt(fakeAmountMantissa.toFixed()),
  priceImpactPercentage: 0,
  callData: '0x',
};

const fakeInput = {
  swapQuote: fakeSwapQuote,
  vToken: vBnb,
  repayFullLoan: false,
  poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
  poolName: 'Fake Pool',
  isSwappingNative: false,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useSwapTokensAndRepay', () => {
  beforeEach(() => {
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));
  });

  it('calls useSendTransaction with the correct parameters for swapping tokens and repaying', async () => {
    renderHook(() => useSwapTokensAndRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeSwapRouterV2ContractAddress",
        "args": [
          "${vBnb.address}",
          "${xvs.address}",
          10000000000000000n,
          10000000000000000n,
          "0x",
        ],
        "functionName": "swapAndRepay",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped and repaid",
        {
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "XVS",
          "poolName": "Fake Pool",
          "priceImpactPercentage": 0,
          "repaidFullLoan": false,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.01,
          "toTokenSymbol": "BNB",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for swapping tokens and repaying full loan', async () => {
    renderHook(() => useSwapTokensAndRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const repayFullLoanInput = {
      ...fakeInput,
      repayFullLoan: true,
      swapQuote: {
        ...fakeSwapQuote,
        direction: 'approximate-out' as const,
      },
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(repayFullLoanInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeSwapRouterV2ContractAddress",
        "args": [
          "${repayFullLoanInput.vToken.address}",
          "${repayFullLoanInput.swapQuote.fromToken.address}",
          10000000000000000n,
          "0x",
        ],
        "functionName": "swapAndRepayFull",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped and repaid",
        {
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "XVS",
          "poolName": "Fake Pool",
          "priceImpactPercentage": 0,
          "repaidFullLoan": false,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.01,
          "toTokenSymbol": "BNB",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for swapping BNB and repaying tokens', async () => {
    renderHook(() => useSwapTokensAndRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const swapBnbInput = {
      ...fakeInput,
      isSwappingNative: true,
      swapQuote: {
        ...fakeSwapQuote,
        fromToken: {
          ...bnb,
          tokenWrapped: bnb,
        },
        toToken: xvs,
        fromTokenAmountSoldMantissa: BigInt(fakeAmountMantissa.toFixed()),
        minimumToTokenAmountReceivedMantissa: BigInt(fakeAmountMantissa.toFixed()),
      },
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(swapBnbInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeSwapRouterV2ContractAddress",
        "args": [
          "${swapBnbInput.vToken.address}",
          10000000000000000n,
          "0x",
        ],
        "functionName": "swapNativeAndRepay",
        "value": 10000000000000000n,
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped and repaid",
        {
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "XVS",
          "poolName": "Fake Pool",
          "priceImpactPercentage": 0,
          "repaidFullLoan": false,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.01,
          "toTokenSymbol": "BNB",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for swapping BNB and repaying full loan', async () => {
    renderHook(() => useSwapTokensAndRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const repayFullLoanWithBnbInput = {
      ...fakeInput,
      repayFullLoan: true,
      isSwappingNative: true,
      swapQuote: {
        ...fakeSwapQuote,
        direction: 'approximate-out' as const,
        fromToken: {
          ...bnb,
          tokenWrapped: bnb,
        },
        toToken: xvs,
      },
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(repayFullLoanWithBnbInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeSwapRouterV2ContractAddress",
        "args": [
          "${repayFullLoanWithBnbInput.vToken.address}",
          "0x",
        ],
        "functionName": "swapNativeAndRepayFull",
        "value": 10000000000000000n,
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped and repaid",
        {
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "XVS",
          "poolName": "Fake Pool",
          "priceImpactPercentage": 0,
          "repaidFullLoan": false,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.01,
          "toTokenSymbol": "BNB",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws incorrectSwapInput for unsupported exact-out swap quote', async () => {
    renderHook(() => useSwapTokensAndRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const unsupportedExactOutInput = {
      ...fakeInput,
      repayFullLoan: false,
      swapQuote: {
        ...fakeSwapQuote,
        direction: 'exact-out' as const,
        toTokenAmountReceivedMantissa: BigInt(fakeAmountMantissa.toFixed()),
        maximumFromTokenAmountSoldMantissa: BigInt(fakeAmountMantissa.toFixed()),
        expectedFromTokenAmountSoldMantissa: BigInt(fakeAmountMantissa.toFixed()),
      },
    };

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(unsupportedExactOutInput)).rejects.toThrow('incorrectSwapInput');
    expect(mockCaptureAnalyticEvent).not.toHaveBeenCalled();
  });

  it('throws when SwapRouter contract address is not available', async () => {
    (getContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useSwapTokensAndRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
