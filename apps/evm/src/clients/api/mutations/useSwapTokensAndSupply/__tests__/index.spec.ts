import fakeAccountAddress from '__mocks__/models/address';
import { usdc, xvs } from '__mocks__/models/tokens';
import { vXvs } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetSwapRouterContractAddress } from 'libs/contracts';
import { renderHook } from 'testUtils/render';
import { generateTransactionDeadline } from 'utilities/generateTransactionDeadline';
import type { Address } from 'viem';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useSwapTokensAndSupply } from '..';

vi.mock('hooks/useSendTransaction');
vi.mock('libs/analytics');
vi.mock('libs/contracts');
vi.mock('utilities/generateTransactionDeadline');

const mockPoolComptrollerAddress = '0x456' as Address;
const mockPoolName = 'Test Pool';
const mockSwapRouterAddress = '0xabc' as Address;
const mockTransactionDeadline = 1000;

const mockSwap = {
  direction: 'exactAmountIn' as const,
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
  beforeEach(() => {
    (useGetSwapRouterContractAddress as Mock).mockReturnValue(mockSwapRouterAddress);
    (generateTransactionDeadline as Mock).mockReturnValue(mockTransactionDeadline);
  });

  it('should throw error if swap router address is not available', async () => {
    (useGetSwapRouterContractAddress as Mock).mockReturnValue(null);

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
    ).rejects.toThrowError('somethingWentWrong');
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

    expect(res).toEqual({
      abi: expect.any(Object),
      address: mockSwapRouterAddress,
      functionName: 'swapExactTokensForTokensAndSupply',
      args: [
        vXvs.address,
        BigInt(mockSwap.fromTokenAmountSoldMantissa.toFixed()),
        BigInt(mockSwap.minimumToTokenAmountReceivedMantissa.toFixed()),
        mockSwap.routePath,
        BigInt(mockTransactionDeadline),
      ],
    });

    onConfirmed({ input: { swap: mockSwap } });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledTimes(1);
    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Tokens swapped and supplied",
        {
          "exchangeRate": 1,
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
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "queryKey": [
              "GET_BALANCE_OF",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
                "tokenAddress": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_TOKEN_ALLOWANCE",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
                "spenderAddress": "0x456",
                "tokenAddress": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_BALANCE_OF",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
                "tokenAddress": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_TOKEN_BALANCES",
              {
                "accountAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
                "chainId": 97,
              },
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_V_TOKEN_BALANCES_ALL",
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_POOLS",
            ],
          },
        ],
      ]
    `);
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
    const res = await fn({ swap: mockSwap });

    expect(res).toMatchInlineSnapshot(
      {
        abi: expect.any(Object),
      },
      `
      {
        "abi": Any<Object>,
        "address": "0xabc",
        "args": [
          "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
          1000n,
          900n,
          [
            "0xdef",
            "0xghi",
          ],
          1000n,
        ],
        "functionName": "swapExactTokensForTokensAndSupply",
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
      direction: 'exactAmountOut' as const,
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

    expect(async () => fn({ swap: invalidMockSwap })).rejects.toThrowError('incorrectSwapInput');
  });
});
