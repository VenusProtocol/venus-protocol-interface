import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getSwapRouterContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useSwapTokensAndRepay } from '..';

import fakeAccountAddress, {
  altAddress as fakePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import { bnb, xvs } from '__mocks__/models/tokens';
import { vBnb } from '__mocks__/models/vTokens';

vi.mock('libs/analytics');
vi.mock('libs/contracts');
vi.mock('utilities/generateTransactionDeadline');

const fakeAmountMantissa = new BigNumber('10000000000000000');

const fakeSwap = {
  direction: 'exactAmountIn' as const,
  fromToken: xvs,
  toToken: bnb,
  fromTokenAmountSoldMantissa: fakeAmountMantissa,
  minimumToTokenAmountReceivedMantissa: fakeAmountMantissa,
  expectedToTokenAmountReceivedMantissa: fakeAmountMantissa,
  exchangeRate: new BigNumber('1'),
  priceImpactPercentage: 0,
  routePath: [xvs.address, bnb.address],
};

const fakeInput = {
  swap: fakeSwap,
  vToken: vBnb,
  repayFullLoan: false,
  poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
  poolName: 'Fake Pool',
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

    (getSwapRouterContractAddress as Mock).mockImplementation(
      () => 'fakeSwapRouterContractAddress',
    );
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
        "address": "fakeSwapRouterContractAddress",
        "args": [
          10000000000000000n,
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          ],
          1747386407n,
        ],
        "functionName": "swapExactTokensForBNBAndRepay",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped and repaid",
        {
          "exchangeRate": 1,
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
      swap: {
        ...fakeSwap,
        direction: 'exactAmountOut' as const,
        toTokenAmountReceivedMantissa: fakeAmountMantissa,
        maximumFromTokenAmountSoldMantissa: fakeAmountMantissa,
        expectedFromTokenAmountSoldMantissa: fakeAmountMantissa,
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
        "address": "fakeSwapRouterContractAddress",
        "args": [
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          ],
          1747386407n,
        ],
        "functionName": "swapTokensForFullBNBDebtAndRepay",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped and repaid",
        {
          "exchangeRate": 1,
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
      swap: {
        ...fakeSwap,
        fromToken: bnb,
        toToken: xvs,
        fromTokenAmountSoldMantissa: fakeAmountMantissa,
        minimumToTokenAmountReceivedMantissa: fakeAmountMantissa,
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
        "address": "fakeSwapRouterContractAddress",
        "args": [
          "0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c",
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          ],
          1747386407n,
        ],
        "functionName": "swapBNBForExactTokensAndRepay",
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
          "exchangeRate": 1,
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

  it('throws when SwapRouter contract address is not available', async () => {
    (getSwapRouterContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useSwapTokensAndRepay(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
