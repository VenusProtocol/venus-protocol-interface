import fakeAccountAddress, {
  altAddress as fakePoolComptrollerAddress,
} from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import type { PendleContractWithdrawCallParams } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useWithdrawFromPendleVault } from '..';

vi.mock('libs/contracts');

const fakePendleMarketAddress = '0x1234567890abcdef1234567890abcdef12345678' as const;

const fakeFromToken = {
  address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
  decimals: 18,
  symbol: 'XVS',
};

const fakeToToken = {
  address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
  decimals: 18,
  isNative: true,
  symbol: 'BNB',
};

const fakeVToken = {
  address: '0x6d6F697e34145Bb95c54E77482d97cc261Dc237E',
  decimals: 8,
  symbol: 'vXVS',
  underlyingToken: fakeFromToken,
};

const fakeContractWithdrawCallParams: PendleContractWithdrawCallParams = [
  '0x7679f4ffc3f7e10b5dc25bf657e12567909f1c6d',
  '0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5',
  '998771595080864',
  {
    tokenOut: '0x0000000000000000000000000000000000000000',
    minTokenOut: '1000000000000000',
    tokenRedeemSy: '0x0000000000000000000000000000000000000000',
    pendleSwap: '0x0000000000000000000000000000000000000000',
    swapData: {
      swapType: '0',
      extRouter: '0x0000000000000000000000000000000000000000',
      extCalldata: '0x',
      needScale: false,
    },
  },
  {
    limitRouter: '0x0000000000000000000000000000000000000000',
    epsSkipMarket: '0',
    normalFills: [],
    flashFills: [],
    optData: '0x',
  },
];

const fakeWithdrawSwapQuote = {
  estimatedReceivedTokensMantissa: new BigNumber('2000000000000000000'),
  feeCents: new BigNumber('100'),
  priceImpactPercentage: 0.5,
  pendleMarketAddress: fakePendleMarketAddress,
  contractCallParams: fakeContractWithdrawCallParams,
  contractCallParamsName: ['receiver', 'market', 'minPtOut', 'input', 'limit'],
  requiredApprovals: [],
};

const fakeAmountToken = new BigNumber('1000000000000000000');

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useWithdrawFromPendleVault', () => {
  beforeEach(() => {
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));
  });

  it('calls useSendTransaction with the correct parameters for withdraw', async () => {
    renderHook(
      () =>
        useWithdrawFromPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
            poolComptrollerAddress: fakePoolComptrollerAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    const withdrawInput = {
      swapQuote: fakeWithdrawSwapQuote,
      type: 'withdraw',
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
      vToken: fakeVToken,
    };

    expect(await fn(withdrawInput)).toMatchInlineSnapshot(`
      {
        "abi": undefined,
        "address": "0xfakePendlePtVaultContractAddress",
        "args": [
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          99877n,
          {
            "minTokenOut": 1000000000000000n,
            "pendleSwap": "0x0000000000000000000000000000000000000000",
            "swapData": {
              "extCalldata": "0x",
              "extRouter": "0x0000000000000000000000000000000000000000",
              "needScale": false,
              "swapType": 0,
            },
            "tokenOut": "0x0000000000000000000000000000000000000000",
            "tokenRedeemSy": "0x0000000000000000000000000000000000000000",
          },
          {
            "epsSkipMarket": 0n,
            "flashFills": [],
            "limitRouter": "0x0000000000000000000000000000000000000000",
            "normalFills": [],
            "optData": "0x",
          },
        ],
        "functionName": "withdraw",
      }
    `);

    await onConfirmed({ input: withdrawInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Pendle vault withdraw",
        {
          "fromTokenAmountTokens": 1,
          "fromTokenSymbol": "XVS",
          "pendleMarketAddress": "0x1234567890abcdef1234567890abcdef12345678",
          "priceImpactPercentage": 0.5,
          "slippageTolerancePercentage": 0.5,
          "toTokenAmountTokens": 2,
          "toTokenSymbol": "BNB",
        },
      ]
    `);

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('calls useSendTransaction with the correct parameters for redeemAtMaturity', async () => {
    renderHook(
      () =>
        useWithdrawFromPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
            poolComptrollerAddress: fakePoolComptrollerAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const redeemInput = {
      swapQuote: fakeWithdrawSwapQuote,
      type: 'redeemAtMaturity',
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
      vToken: fakeVToken,
    };

    expect(await fn(redeemInput)).toMatchInlineSnapshot(`
      {
        "abi": undefined,
        "address": "0xfakePendlePtVaultContractAddress",
        "args": [
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          99877n,
          {
            "minTokenOut": 1000000000000000n,
            "pendleSwap": "0x0000000000000000000000000000000000000000",
            "swapData": {
              "extCalldata": "0x",
              "extRouter": "0x0000000000000000000000000000000000000000",
              "needScale": false,
              "swapType": 0,
            },
            "tokenOut": "0x0000000000000000000000000000000000000000",
            "tokenRedeemSy": "0x0000000000000000000000000000000000000000",
          },
          {
            "epsSkipMarket": 0n,
            "flashFills": [],
            "limitRouter": "0x0000000000000000000000000000000000000000",
            "normalFills": [],
            "optData": "0x",
          },
        ],
        "functionName": "redeemAtMaturity",
      }
    `);
  });

  it('throws when vToken is missing', async () => {
    renderHook(
      () =>
        useWithdrawFromPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const invalidInput = {
      swapQuote: fakeWithdrawSwapQuote,
      type: 'withdraw',
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
    };

    await expect(async () => fn(invalidInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(
      () =>
        useWithdrawFromPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const withdrawInput = {
      swapQuote: fakeWithdrawSwapQuote,
      type: 'withdraw',
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
      vToken: fakeVToken,
    };

    await expect(async () => fn(withdrawInput)).rejects.toThrow('somethingWentWrong');
  });
});
