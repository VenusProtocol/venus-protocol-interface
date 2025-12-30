import fakeAccountAddress from '__mocks__/models/address';
import { bnb, usdc, xvs } from '__mocks__/models/tokens';
import { vXvs } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Address } from 'viem';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useSwapTokensAndSupply } from '..';

vi.mock('libs/contracts');
vi.mock('utilities/generateTransactionDeadline');

const mockPoolComptrollerAddress = '0x456' as Address;
const mockPoolName = 'Test Pool';

const mockSwap = {
  direction: 'exact-in' as const,
  fromToken: xvs,
  toToken: usdc,
  fromTokenAmountSoldMantissa: new BigNumber(1000),
  minimumToTokenAmountReceivedMantissa: new BigNumber(900),
  routePath: ['0xdef' as Address, '0xghi' as Address],
  priceImpactPercentage: 0.1,
  exchangeRate: new BigNumber(1),
  expectedToTokenAmountReceivedMantissa: new BigNumber(1000),
};

describe('useSwapTokensAndSupply', () => {
  it('should throw error if swap router address is not available', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(
      () =>
        useSwapTokensAndSupply({
          vToken: vXvs,
          poolComptrollerAddress: mockPoolComptrollerAddress,
          poolName: mockPoolName,
        }),
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () =>
      fn({
        swap: mockSwap,
      }),
    ).rejects.toThrow('somethingWentWrong');
  });

  it('should handle token to token swap correctly', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(
      () =>
        useSwapTokensAndSupply({
          vToken: vXvs,
          poolComptrollerAddress: mockPoolComptrollerAddress,
          poolName: mockPoolName,
        }),
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    const res = await fn({ swap: mockSwap });

    expect(res).toMatchInlineSnapshot(
      {
        abi: expect.any(Object),
      },
      `
      {
        "abi": Any<Object>,
        "address": "0xfakeSwapRouterV2ContractAddress",
        "args": [
          "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
          "1000",
          "900",
          undefined,
        ],
        "functionName": "swapAndSupply",
      }
    `,
    );

    onConfirmed({ input: { swap: mockSwap } });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped and supplied",
        {
          "fromTokenAmountTokens": 1e-15,
          "fromTokenSymbol": "XVS",
          "poolName": "Test Pool",
          "priceImpactPercentage": 0.1,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 0.001,
          "toTokenSymbol": "USDC",
        },
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(6);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('should handle BNB to token swap correctly', async () => {
    renderHook(
      () =>
        useSwapTokensAndSupply({
          vToken: vXvs,
          poolComptrollerAddress: mockPoolComptrollerAddress,
          poolName: mockPoolName,
        }),
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];
    const res = await fn({ swap: { ...mockSwap, fromToken: bnb } });

    expect(res).toMatchInlineSnapshot(
      {
        abi: expect.any(Object),
      },
      `
      {
        "abi": Any<Object>,
        "address": "0xfakeSwapRouterV2ContractAddress",
        "args": [
          "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
          "900",
          undefined,
        ],
        "functionName": "swapNativeAndSupply",
        "value": "1000",
      }
    `,
    );
  });

  it('should throw error for unsupported swap direction', async () => {
    renderHook(
      () =>
        useSwapTokensAndSupply({
          vToken: vXvs,
          poolComptrollerAddress: mockPoolComptrollerAddress,
          poolName: mockPoolName,
        }),
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const invalidMockSwap = {
      direction: 'exact-out' as const,
      fromToken: {
        isNative: false,
        address: '0xdef' as Address,
        symbol: 'FROM',
        decimals: 18,
        asset: 'FROM',
      },
      toToken: {
        isNative: false,
        address: '0xghi' as Address,
        symbol: 'TO',
        decimals: 18,
        asset: 'TO',
      },
      expectedFromTokenAmountSoldMantissa: new BigNumber(1000),
      maximumFromTokenAmountSoldMantissa: new BigNumber(1100),
      toTokenAmountReceivedMantissa: new BigNumber(900),
      routePath: ['0xdef' as Address, '0xghi' as Address],
      priceImpactPercentage: 0.1,
      exchangeRate: new BigNumber(1),
    };

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(async () => fn({ swap: invalidMockSwap })).rejects.toThrow('incorrectSwapInput');
  });
});
