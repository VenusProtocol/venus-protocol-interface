import fakeAccountAddress, {
  altAddress as fakePoolComptrollerAddress,
} from '__mocks__/models/address';
import { bnb, xvs } from '__mocks__/models/tokens';
import { vXvs } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api';
import type { PendleContractCallParams } from 'clients/api/queries/getPendleSwapQuote';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { usePendlePtVault } from '..';
import type { PendlePtVaultInput } from '..';

vi.mock('libs/contracts');

const fakePendleMarketAddress = '0x1234567890abcdef1234567890abcdef12345678' as const;

const fakeContractCallParams: PendleContractCallParams = [
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

const fakeSwapQuote = {
  estReceiveMantissa: new BigNumber('2000000000000000000'),
  feeUsdCents: new BigNumber('100'),
  priceImpactPercentage: 0.5,
  pendleMarketAddress: fakePendleMarketAddress,
  contractCallParams: fakeContractCallParams,
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
        usePendlePtVault(
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

    const depositInput: Omit<PendlePtVaultInput, 'pendlePtVaultContractAddress'> = {
      swapQuote: fakeSwapQuote,
      type: 'deposit',
      fromToken: xvs,
      toToken: bnb,
      amountToken: fakeAmountToken,
    };

    expect(await fn(depositInput)).toMatchInlineSnapshot(
      { abi: expect.any(Array) },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakePendlePtVaultContractAddress",
        "args": [
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          998771595080864n,
          {
            "eps": 1000000000000n,
            "guessMax": 1059303206903946n,
            "guessMin": 504430098525689n,
            "guessOffchain": 1008860197051378n,
            "maxIteration": 30,
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
    `,
    );

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
        usePendlePtVault(
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

    const depositNativeInput: Omit<PendlePtVaultInput, 'pendlePtVaultContractAddress'> = {
      swapQuote: fakeSwapQuote,
      type: 'deposit',
      fromToken: bnb,
      toToken: xvs,
      amountToken: fakeAmountToken,
    };

    expect(await fn(depositNativeInput)).toMatchInlineSnapshot(
      { abi: expect.any(Array) },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakePendlePtVaultContractAddress",
        "args": [
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          998771595080864n,
          {
            "eps": 1000000000000n,
            "guessMax": 1059303206903946n,
            "guessMin": 504430098525689n,
            "guessOffchain": 1008860197051378n,
            "maxIteration": 30,
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
    `,
    );
  });

  it('calls useSendTransaction with the correct parameters for withdraw', async () => {
    renderHook(
      () =>
        usePendlePtVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
            poolComptrollerAddress: fakePoolComptrollerAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const withdrawInput: Omit<PendlePtVaultInput, 'pendlePtVaultContractAddress'> = {
      swapQuote: fakeSwapQuote,
      type: 'withdraw',
      fromToken: xvs,
      toToken: bnb,
      amountToken: fakeAmountToken,
      vToken: vXvs,
    };

    const result = await fn(withdrawInput);

    expect(result).toMatchInlineSnapshot(
      { abi: expect.any(Array) },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakePendlePtVaultContractAddress",
        "args": [
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          99877n,
          {
            "eps": 1000000000000n,
            "guessMax": 1059303206903946n,
            "guessMin": 504430098525689n,
            "guessOffchain": 1008860197051378n,
            "maxIteration": 30,
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
        ],
        "functionName": "withdraw",
      }
    `,
    );
  });

  it('calls useSendTransaction with the correct parameters for redeemAtMaturity', async () => {
    renderHook(
      () =>
        usePendlePtVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
            poolComptrollerAddress: fakePoolComptrollerAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const redeemInput: Omit<PendlePtVaultInput, 'pendlePtVaultContractAddress'> = {
      swapQuote: fakeSwapQuote,
      type: 'redeemAtMaturity',
      fromToken: xvs,
      toToken: bnb,
      amountToken: fakeAmountToken,
      vToken: vXvs,
    };

    const result = await fn(redeemInput);

    expect(result).toMatchInlineSnapshot(
      { abi: expect.any(Array) },
      `
      {
        "abi": Any<Array>,
        "address": "0xfakePendlePtVaultContractAddress",
        "args": [
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          99877n,
          {
            "eps": 1000000000000n,
            "guessMax": 1059303206903946n,
            "guessMin": 504430098525689n,
            "guessOffchain": 1008860197051378n,
            "maxIteration": 30,
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
        ],
        "functionName": "redeemAtMaturity",
      }
    `,
    );
  });

  it('throws when type is invalid', async () => {
    renderHook(
      () =>
        usePendlePtVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const invalidInput: Omit<PendlePtVaultInput, 'pendlePtVaultContractAddress'> = {
      swapQuote: fakeSwapQuote,
      type: 'withdraw',
      fromToken: xvs,
      toToken: bnb,
      amountToken: fakeAmountToken,
      // missing vToken for withdraw
    };

    await expect(async () => fn(invalidInput)).rejects.toThrow('incorrectSwapInput');
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(
      () =>
        usePendlePtVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const depositInput: Omit<PendlePtVaultInput, 'pendlePtVaultContractAddress'> = {
      swapQuote: fakeSwapQuote,
      type: 'deposit',
      fromToken: xvs,
      toToken: bnb,
      amountToken: fakeAmountToken,
    };

    await expect(async () => fn(depositInput)).rejects.toThrow('somethingWentWrong');
  });
});
