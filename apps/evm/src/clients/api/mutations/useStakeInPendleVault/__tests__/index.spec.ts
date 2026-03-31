import fakeAccountAddress, {
  altAddress as fakePoolComptrollerAddress,
} from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import type { PendleContractDepositCallParams } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useStakeInPendleVault } from '..';

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

const fakeContractDepositCallParams: PendleContractDepositCallParams = [
  '0x7679f4ffc3f7e10b5dc25bf657e12567909f1c6d',
  '0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5',
  '998771595080864',
  {
    guessMin: '504430098525689',
    guessMax: '1059303206903946',
    guessOffchain: '1008860197051378',
    maxIteration: '30',
    eps: '1000000000000',
  },
  {
    tokenIn: '0x0000000000000000000000000000000000000000',
    netTokenIn: '1000000000000000',
    tokenMintSy: '0x0000000000000000000000000000000000000000',
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

const fakeDepositSwapQuote = {
  estimatedReceivedTokensMantissa: new BigNumber('2000000000000000000'),
  feeCents: new BigNumber('100'),
  priceImpactPercentage: 0.5,
  pendleMarketAddress: fakePendleMarketAddress,
  contractCallParams: fakeContractDepositCallParams,
  contractCallParamsName: ['receiver', 'market', 'minPtOut', 'guessPtOut', 'input', 'limit'],
  requiredApprovals: [],
};

const fakeAmountToken = new BigNumber('1000000000000000000');

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('usePendlePtVault', () => {
  beforeEach(() => {
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));
  });

  it('calls useSendTransaction with the correct parameters for deposit', async () => {
    renderHook(
      () =>
        useStakeInPendleVault(
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

    const depositInput = {
      swapQuote: fakeDepositSwapQuote,
      type: 'deposit',
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
    };

    expect(await fn(depositInput)).toMatchInlineSnapshot(`
      {
        "abi": undefined,
        "address": "0xfakePendlePtVaultContractAddress",
        "args": [
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          998771595080864n,
          {
            "eps": 1000000000000n,
            "guessMax": 1059303206903946n,
            "guessMin": 504430098525689n,
            "guessOffchain": 1008860197051378n,
            "maxIteration": 30n,
          },
          {
            "netTokenIn": 1000000000000000n,
            "pendleSwap": "0x0000000000000000000000000000000000000000",
            "swapData": {
              "extCalldata": "0x",
              "extRouter": "0x0000000000000000000000000000000000000000",
              "needScale": false,
              "swapType": 0,
            },
            "tokenIn": "0x0000000000000000000000000000000000000000",
            "tokenMintSy": "0x0000000000000000000000000000000000000000",
          },
          {
            "epsSkipMarket": 0n,
            "flashFills": [],
            "limitRouter": "0x0000000000000000000000000000000000000000",
            "normalFills": [],
            "optData": "0x",
          },
        ],
        "functionName": "deposit",
      }
    `);

    onConfirmed({ input: depositInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Pendle vault deposit",
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

  it('calls useSendTransaction with the correct parameters for native deposit', async () => {
    renderHook(
      () =>
        useStakeInPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
            poolComptrollerAddress: fakePoolComptrollerAddress,
            isNative: true,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const depositNativeInput = {
      swapQuote: fakeDepositSwapQuote,
      type: 'deposit',
      fromToken: fakeToToken,
      toToken: fakeFromToken,
      amountMantissa: fakeAmountToken,
    };

    expect(await fn(depositNativeInput)).toMatchInlineSnapshot(`
      {
        "abi": undefined,
        "address": "0xfakePendlePtVaultContractAddress",
        "args": [
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          998771595080864n,
          {
            "eps": 1000000000000n,
            "guessMax": 1059303206903946n,
            "guessMin": 504430098525689n,
            "guessOffchain": 1008860197051378n,
            "maxIteration": 30n,
          },
          {
            "netTokenIn": 1000000000000000n,
            "pendleSwap": "0x0000000000000000000000000000000000000000",
            "swapData": {
              "extCalldata": "0x",
              "extRouter": "0x0000000000000000000000000000000000000000",
              "needScale": false,
              "swapType": 0,
            },
            "tokenIn": "0x0000000000000000000000000000000000000000",
            "tokenMintSy": "0x0000000000000000000000000000000000000000",
          },
          {
            "epsSkipMarket": 0n,
            "flashFills": [],
            "limitRouter": "0x0000000000000000000000000000000000000000",
            "normalFills": [],
            "optData": "0x",
          },
        ],
        "functionName": "depositNative",
        "value": 1000000000000000000n,
      }
    `);
  });

  it('throws when type is invalid', async () => {
    renderHook(
      () =>
        useStakeInPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const invalidInput = {
      swapQuote: fakeDepositSwapQuote,
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
        useStakeInPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const depositInput = {
      swapQuote: fakeDepositSwapQuote,
      type: 'deposit',
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
    };

    await expect(async () => fn(depositInput)).rejects.toThrow('somethingWentWrong');
  });
});
