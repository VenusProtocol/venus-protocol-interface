import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useSwapTokens } from '..';

import fakeAccountAddress, {
  altAddress as fakePoolComptrollerContractAddress,
} from '__mocks__/models/address';
import { bnb, usdt, xvs } from '__mocks__/models/tokens';
import { getContractAddress } from 'libs/contracts';

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
  poolComptrollerContractAddress: fakePoolComptrollerContractAddress,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useSwapTokens', () => {
  beforeEach(() => {
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));
  });

  it('calls useSendTransaction with the correct parameters when selling fromTokens for as many toTokens as possible', async () => {
    renderHook(() => useSwapTokens(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const swapTokensInput = {
      ...fakeInput,
      swap: {
        ...fakeSwap,
        fromToken: xvs,
        toToken: usdt,
        routePath: [xvs.address, usdt.address],
      },
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(swapTokensInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeSwapRouterContractAddress",
        "args": [
          10000000000000000n,
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c",
          ],
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          1747386407n,
        ],
        "functionName": "swapExactTokensForTokens",
      }
    `,
    );

    onConfirmed({ input: swapTokensInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped",
        {
          "exchangeRate": 1,
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "XVS",
          "priceImpactPercentage": 0,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 10000000000,
          "toTokenSymbol": "USDT",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when selling BNBs for as many toTokens as possible', async () => {
    renderHook(() => useSwapTokens(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const swapBnbInput = {
      ...fakeInput,
      swap: {
        ...fakeSwap,
        fromToken: bnb,
        toToken: xvs,
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
        "address": "0xfakeSwapRouterContractAddress",
        "args": [
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          ],
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          1747386407n,
        ],
        "functionName": "swapExactBNBForTokens",
        "value": 10000000000000000n,
      }
    `,
    );

    onConfirmed({ input: swapBnbInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped",
        {
          "exchangeRate": 1,
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "BNB",
          "priceImpactPercentage": 0,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.01,
          "toTokenSymbol": "XVS",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when selling fromTokens for as many BNBs as possible', async () => {
    renderHook(() => useSwapTokens(fakeOptions), {
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
        "address": "0xfakeSwapRouterContractAddress",
        "args": [
          10000000000000000n,
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          ],
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          1747386407n,
        ],
        "functionName": "swapExactTokensForBNB",
      }
    `,
    );

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped",
        {
          "exchangeRate": 1,
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "XVS",
          "priceImpactPercentage": 0,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.01,
          "toTokenSymbol": "BNB",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when buying toTokens by selling as few fromTokens as possible', async () => {
    renderHook(() => useSwapTokens(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const swapExactTokensInput = {
      ...fakeInput,
      swap: {
        ...fakeSwap,
        direction: 'exactAmountOut' as const,
        fromToken: xvs,
        toToken: usdt,
        toTokenAmountReceivedMantissa: fakeAmountMantissa,
        maximumFromTokenAmountSoldMantissa: fakeAmountMantissa,
        expectedFromTokenAmountSoldMantissa: fakeAmountMantissa,
        routePath: [xvs.address, usdt.address],
      },
    };

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(swapExactTokensInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeSwapRouterContractAddress",
        "args": [
          10000000000000000n,
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c",
          ],
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          1747386407n,
        ],
        "functionName": "swapTokensForExactTokens",
      }
    `,
    );

    onConfirmed({ input: swapExactTokensInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped",
        {
          "exchangeRate": 1,
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "XVS",
          "priceImpactPercentage": 0,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 10000000000,
          "toTokenSymbol": "USDT",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when buying toTokens by selling as few BNBs as possible', async () => {
    renderHook(() => useSwapTokens(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const swapBnbForExactTokensInput = {
      ...fakeInput,
      swap: {
        ...fakeSwap,
        direction: 'exactAmountOut' as const,
        fromToken: bnb,
        toToken: xvs,
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

    expect(await fn(swapBnbForExactTokensInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeSwapRouterContractAddress",
        "args": [
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          ],
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          1747386407n,
        ],
        "functionName": "swapBNBForExactTokens",
        "value": 10000000000000000n,
      }
    `,
    );

    onConfirmed({ input: swapBnbForExactTokensInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped",
        {
          "exchangeRate": 1,
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "BNB",
          "priceImpactPercentage": 0,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.01,
          "toTokenSymbol": "XVS",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters when buying BNBs by selling as few fromTokens as possible', async () => {
    renderHook(() => useSwapTokens(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const swapExactBnbInput = {
      ...fakeInput,
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

    expect(await fn(swapExactBnbInput)).toMatchInlineSnapshot(
      {
        abi: expect.any(Array),
      },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakeSwapRouterContractAddress",
        "args": [
          10000000000000000n,
          10000000000000000n,
          [
            "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          ],
          "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          1747386407n,
        ],
        "functionName": "swapTokensForExactBNB",
      }
    `,
    );

    onConfirmed({ input: swapExactBnbInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped",
        {
          "exchangeRate": 1,
          "fromTokenAmountTokens": 0.01,
          "fromTokenSymbol": "XVS",
          "priceImpactPercentage": 0,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.01,
          "toTokenSymbol": "BNB",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when account address is not available', async () => {
    renderHook(() => useSwapTokens(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when swap router contract address is not available', async () => {
    (getContractAddress as Mock).mockImplementation(() => undefined);

    renderHook(() => useSwapTokens(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
