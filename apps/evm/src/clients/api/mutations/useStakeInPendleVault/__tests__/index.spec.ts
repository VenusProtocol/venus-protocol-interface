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
        "abi": [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleRouter_",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "comptroller_",
                "type": "address",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "constructor",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "expected",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "received",
                "type": "uint256",
              },
            ],
            "name": "InputAmountMismatch",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "InvalidTokenInput",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "maturity",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "currentTime",
                "type": "uint256",
              },
            ],
            "name": "MarketAlreadyMatured",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
            ],
            "name": "MarketAlreadyRegistered",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "maturity",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "currentTime",
                "type": "uint256",
              },
            ],
            "name": "MarketNotMatured",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
            ],
            "name": "MarketNotRegistered",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "sender",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "calledContract",
                "type": "address",
              },
              {
                "internalType": "string",
                "name": "methodSignature",
                "type": "string",
              },
            ],
            "name": "Unauthorized",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "expectedUnderlying",
                "type": "address",
              },
            ],
            "name": "UnderlyingMismatch",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "errorCode",
                "type": "uint256",
              },
            ],
            "name": "VTokenMintFailed",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
            ],
            "name": "VTokenNotListed",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "errorCode",
                "type": "uint256",
              },
            ],
            "name": "VTokenRedeemFailed",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "ZeroAddress",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "ZeroAmount",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "ZeroVTokensMinted",
            "type": "error",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "tokenIn",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "ptAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
            ],
            "name": "Deposited",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint8",
                "name": "version",
                "type": "uint8",
              },
            ],
            "name": "Initialized",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "pt",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "maturity",
                "type": "uint256",
              },
            ],
            "name": "MarketAdded",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "oldAccessControlManager",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "newAccessControlManager",
                "type": "address",
              },
            ],
            "name": "NewAccessControlManager",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
              },
            ],
            "name": "OwnershipTransferStarted",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
              },
            ],
            "name": "OwnershipTransferred",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address",
              },
            ],
            "name": "Paused",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "tokenOut",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "ptAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256",
              },
            ],
            "name": "RedeemedAtMaturity",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "SweepNative",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "SweepTokens",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address",
              },
            ],
            "name": "Unpaused",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "tokenOut",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "ptAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256",
              },
            ],
            "name": "Withdrawn",
            "type": "event",
          },
          {
            "inputs": [],
            "name": "COMPTROLLER",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "PENDLE_ROUTER",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "acceptOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "accessControlManager",
            "outputs": [
              {
                "internalType": "contract IAccessControlManagerV8",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
            ],
            "name": "addMarket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "minPtOut",
                "type": "uint256",
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "guessMin",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "guessMax",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "guessOffchain",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "maxIteration",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "eps",
                    "type": "uint256",
                  },
                ],
                "internalType": "struct ApproxParams",
                "name": "guessPtOut",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "netTokenIn",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "tokenMintSy",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "pendleSwap",
                    "type": "address",
                  },
                  {
                    "components": [
                      {
                        "internalType": "enum SwapType",
                        "name": "swapType",
                        "type": "uint8",
                      },
                      {
                        "internalType": "address",
                        "name": "extRouter",
                        "type": "address",
                      },
                      {
                        "internalType": "bytes",
                        "name": "extCalldata",
                        "type": "bytes",
                      },
                      {
                        "internalType": "bool",
                        "name": "needScale",
                        "type": "bool",
                      },
                    ],
                    "internalType": "struct SwapData",
                    "name": "swapData",
                    "type": "tuple",
                  },
                ],
                "internalType": "struct TokenInput",
                "name": "input",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "limitRouter",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "epsSkipMarket",
                    "type": "uint256",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "normalFills",
                    "type": "tuple[]",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "flashFills",
                    "type": "tuple[]",
                  },
                  {
                    "internalType": "bytes",
                    "name": "optData",
                    "type": "bytes",
                  },
                ],
                "internalType": "struct LimitOrderData",
                "name": "limit",
                "type": "tuple",
              },
            ],
            "name": "deposit",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "netVTokensMinted",
                "type": "uint256",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "minPtOut",
                "type": "uint256",
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "guessMin",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "guessMax",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "guessOffchain",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "maxIteration",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "eps",
                    "type": "uint256",
                  },
                ],
                "internalType": "struct ApproxParams",
                "name": "guessPtOut",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "netTokenIn",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "tokenMintSy",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "pendleSwap",
                    "type": "address",
                  },
                  {
                    "components": [
                      {
                        "internalType": "enum SwapType",
                        "name": "swapType",
                        "type": "uint8",
                      },
                      {
                        "internalType": "address",
                        "name": "extRouter",
                        "type": "address",
                      },
                      {
                        "internalType": "bytes",
                        "name": "extCalldata",
                        "type": "bytes",
                      },
                      {
                        "internalType": "bool",
                        "name": "needScale",
                        "type": "bool",
                      },
                    ],
                    "internalType": "struct SwapData",
                    "name": "swapData",
                    "type": "tuple",
                  },
                ],
                "internalType": "struct TokenInput",
                "name": "input",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "limitRouter",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "epsSkipMarket",
                    "type": "uint256",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "normalFills",
                    "type": "tuple[]",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "flashFills",
                    "type": "tuple[]",
                  },
                  {
                    "internalType": "bytes",
                    "name": "optData",
                    "type": "bytes",
                  },
                ],
                "internalType": "struct LimitOrderData",
                "name": "limit",
                "type": "tuple",
              },
            ],
            "name": "depositNative",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "netVTokensMinted",
                "type": "uint256",
              },
            ],
            "stateMutability": "payable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "getAllMarkets",
            "outputs": [
              {
                "internalType": "address[]",
                "name": "",
                "type": "address[]",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "getMarketCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "accessControlManager_",
                "type": "address",
              },
            ],
            "name": "initialize",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "user",
                "type": "address",
              },
            ],
            "name": "isDelegated",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
            ],
            "name": "isMatured",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "name": "marketList",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "name": "markets",
            "outputs": [
              {
                "internalType": "address",
                "name": "pt",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "sy",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "yt",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "maturity",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "pause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "paused",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "pendingOwner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "minTokenOut",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "tokenRedeemSy",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "pendleSwap",
                    "type": "address",
                  },
                  {
                    "components": [
                      {
                        "internalType": "enum SwapType",
                        "name": "swapType",
                        "type": "uint8",
                      },
                      {
                        "internalType": "address",
                        "name": "extRouter",
                        "type": "address",
                      },
                      {
                        "internalType": "bytes",
                        "name": "extCalldata",
                        "type": "bytes",
                      },
                      {
                        "internalType": "bool",
                        "name": "needScale",
                        "type": "bool",
                      },
                    ],
                    "internalType": "struct SwapData",
                    "name": "swapData",
                    "type": "tuple",
                  },
                ],
                "internalType": "struct TokenOutput",
                "name": "output",
                "type": "tuple",
              },
            ],
            "name": "redeemAtMaturity",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "netTokenOut",
                "type": "uint256",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "accessControlManager_",
                "type": "address",
              },
            ],
            "name": "setAccessControlManager",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address payable",
                "name": "to",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "sweepNative",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "token",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "sweepTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
              },
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "unpause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "minTokenOut",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "tokenRedeemSy",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "pendleSwap",
                    "type": "address",
                  },
                  {
                    "components": [
                      {
                        "internalType": "enum SwapType",
                        "name": "swapType",
                        "type": "uint8",
                      },
                      {
                        "internalType": "address",
                        "name": "extRouter",
                        "type": "address",
                      },
                      {
                        "internalType": "bytes",
                        "name": "extCalldata",
                        "type": "bytes",
                      },
                      {
                        "internalType": "bool",
                        "name": "needScale",
                        "type": "bool",
                      },
                    ],
                    "internalType": "struct SwapData",
                    "name": "swapData",
                    "type": "tuple",
                  },
                ],
                "internalType": "struct TokenOutput",
                "name": "output",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "limitRouter",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "epsSkipMarket",
                    "type": "uint256",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "normalFills",
                    "type": "tuple[]",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "flashFills",
                    "type": "tuple[]",
                  },
                  {
                    "internalType": "bytes",
                    "name": "optData",
                    "type": "bytes",
                  },
                ],
                "internalType": "struct LimitOrderData",
                "name": "limit",
                "type": "tuple",
              },
            ],
            "name": "withdraw",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "netTokenOut",
                "type": "uint256",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "stateMutability": "payable",
            "type": "receive",
          },
        ],
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
        "abi": [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleRouter_",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "comptroller_",
                "type": "address",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "constructor",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "expected",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "received",
                "type": "uint256",
              },
            ],
            "name": "InputAmountMismatch",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "InvalidTokenInput",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "maturity",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "currentTime",
                "type": "uint256",
              },
            ],
            "name": "MarketAlreadyMatured",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
            ],
            "name": "MarketAlreadyRegistered",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "maturity",
                "type": "uint256",
              },
              {
                "internalType": "uint256",
                "name": "currentTime",
                "type": "uint256",
              },
            ],
            "name": "MarketNotMatured",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
            ],
            "name": "MarketNotRegistered",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "sender",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "calledContract",
                "type": "address",
              },
              {
                "internalType": "string",
                "name": "methodSignature",
                "type": "string",
              },
            ],
            "name": "Unauthorized",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "expectedUnderlying",
                "type": "address",
              },
            ],
            "name": "UnderlyingMismatch",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "errorCode",
                "type": "uint256",
              },
            ],
            "name": "VTokenMintFailed",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
            ],
            "name": "VTokenNotListed",
            "type": "error",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "errorCode",
                "type": "uint256",
              },
            ],
            "name": "VTokenRedeemFailed",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "ZeroAddress",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "ZeroAmount",
            "type": "error",
          },
          {
            "inputs": [],
            "name": "ZeroVTokensMinted",
            "type": "error",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "tokenIn",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountIn",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "ptAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
            ],
            "name": "Deposited",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint8",
                "name": "version",
                "type": "uint8",
              },
            ],
            "name": "Initialized",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "pt",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "maturity",
                "type": "uint256",
              },
            ],
            "name": "MarketAdded",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "oldAccessControlManager",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "address",
                "name": "newAccessControlManager",
                "type": "address",
              },
            ],
            "name": "NewAccessControlManager",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
              },
            ],
            "name": "OwnershipTransferStarted",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
              },
            ],
            "name": "OwnershipTransferred",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address",
              },
            ],
            "name": "Paused",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "tokenOut",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "ptAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256",
              },
            ],
            "name": "RedeemedAtMaturity",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "SweepNative",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "token",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "SweepTokens",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address",
              },
            ],
            "name": "Unpaused",
            "type": "event",
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": true,
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address",
              },
              {
                "indexed": true,
                "internalType": "address",
                "name": "tokenOut",
                "type": "address",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "ptAmount",
                "type": "uint256",
              },
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "amountOut",
                "type": "uint256",
              },
            ],
            "name": "Withdrawn",
            "type": "event",
          },
          {
            "inputs": [],
            "name": "COMPTROLLER",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "PENDLE_ROUTER",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "acceptOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "accessControlManager",
            "outputs": [
              {
                "internalType": "contract IAccessControlManagerV8",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
            ],
            "name": "addMarket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "minPtOut",
                "type": "uint256",
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "guessMin",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "guessMax",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "guessOffchain",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "maxIteration",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "eps",
                    "type": "uint256",
                  },
                ],
                "internalType": "struct ApproxParams",
                "name": "guessPtOut",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "netTokenIn",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "tokenMintSy",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "pendleSwap",
                    "type": "address",
                  },
                  {
                    "components": [
                      {
                        "internalType": "enum SwapType",
                        "name": "swapType",
                        "type": "uint8",
                      },
                      {
                        "internalType": "address",
                        "name": "extRouter",
                        "type": "address",
                      },
                      {
                        "internalType": "bytes",
                        "name": "extCalldata",
                        "type": "bytes",
                      },
                      {
                        "internalType": "bool",
                        "name": "needScale",
                        "type": "bool",
                      },
                    ],
                    "internalType": "struct SwapData",
                    "name": "swapData",
                    "type": "tuple",
                  },
                ],
                "internalType": "struct TokenInput",
                "name": "input",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "limitRouter",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "epsSkipMarket",
                    "type": "uint256",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "normalFills",
                    "type": "tuple[]",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "flashFills",
                    "type": "tuple[]",
                  },
                  {
                    "internalType": "bytes",
                    "name": "optData",
                    "type": "bytes",
                  },
                ],
                "internalType": "struct LimitOrderData",
                "name": "limit",
                "type": "tuple",
              },
            ],
            "name": "deposit",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "netVTokensMinted",
                "type": "uint256",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "minPtOut",
                "type": "uint256",
              },
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "guessMin",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "guessMax",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "guessOffchain",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "maxIteration",
                    "type": "uint256",
                  },
                  {
                    "internalType": "uint256",
                    "name": "eps",
                    "type": "uint256",
                  },
                ],
                "internalType": "struct ApproxParams",
                "name": "guessPtOut",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenIn",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "netTokenIn",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "tokenMintSy",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "pendleSwap",
                    "type": "address",
                  },
                  {
                    "components": [
                      {
                        "internalType": "enum SwapType",
                        "name": "swapType",
                        "type": "uint8",
                      },
                      {
                        "internalType": "address",
                        "name": "extRouter",
                        "type": "address",
                      },
                      {
                        "internalType": "bytes",
                        "name": "extCalldata",
                        "type": "bytes",
                      },
                      {
                        "internalType": "bool",
                        "name": "needScale",
                        "type": "bool",
                      },
                    ],
                    "internalType": "struct SwapData",
                    "name": "swapData",
                    "type": "tuple",
                  },
                ],
                "internalType": "struct TokenInput",
                "name": "input",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "limitRouter",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "epsSkipMarket",
                    "type": "uint256",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "normalFills",
                    "type": "tuple[]",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "flashFills",
                    "type": "tuple[]",
                  },
                  {
                    "internalType": "bytes",
                    "name": "optData",
                    "type": "bytes",
                  },
                ],
                "internalType": "struct LimitOrderData",
                "name": "limit",
                "type": "tuple",
              },
            ],
            "name": "depositNative",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "netVTokensMinted",
                "type": "uint256",
              },
            ],
            "stateMutability": "payable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "getAllMarkets",
            "outputs": [
              {
                "internalType": "address[]",
                "name": "",
                "type": "address[]",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "getMarketCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "accessControlManager_",
                "type": "address",
              },
            ],
            "name": "initialize",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "user",
                "type": "address",
              },
            ],
            "name": "isDelegated",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
            ],
            "name": "isMatured",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256",
              },
            ],
            "name": "marketList",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "name": "markets",
            "outputs": [
              {
                "internalType": "address",
                "name": "pt",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "sy",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "yt",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "vToken",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "maturity",
                "type": "uint256",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "owner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "pause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "paused",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "pendingOwner",
            "outputs": [
              {
                "internalType": "address",
                "name": "",
                "type": "address",
              },
            ],
            "stateMutability": "view",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "minTokenOut",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "tokenRedeemSy",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "pendleSwap",
                    "type": "address",
                  },
                  {
                    "components": [
                      {
                        "internalType": "enum SwapType",
                        "name": "swapType",
                        "type": "uint8",
                      },
                      {
                        "internalType": "address",
                        "name": "extRouter",
                        "type": "address",
                      },
                      {
                        "internalType": "bytes",
                        "name": "extCalldata",
                        "type": "bytes",
                      },
                      {
                        "internalType": "bool",
                        "name": "needScale",
                        "type": "bool",
                      },
                    ],
                    "internalType": "struct SwapData",
                    "name": "swapData",
                    "type": "tuple",
                  },
                ],
                "internalType": "struct TokenOutput",
                "name": "output",
                "type": "tuple",
              },
            ],
            "name": "redeemAtMaturity",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "netTokenOut",
                "type": "uint256",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "accessControlManager_",
                "type": "address",
              },
            ],
            "name": "setAccessControlManager",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address payable",
                "name": "to",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "sweepNative",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "token",
                "type": "address",
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256",
              },
            ],
            "name": "sweepTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "newOwner",
                "type": "address",
              },
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [],
            "name": "unpause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "pendleMarket",
                "type": "address",
              },
              {
                "internalType": "uint256",
                "name": "vTokenAmount",
                "type": "uint256",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "tokenOut",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "minTokenOut",
                    "type": "uint256",
                  },
                  {
                    "internalType": "address",
                    "name": "tokenRedeemSy",
                    "type": "address",
                  },
                  {
                    "internalType": "address",
                    "name": "pendleSwap",
                    "type": "address",
                  },
                  {
                    "components": [
                      {
                        "internalType": "enum SwapType",
                        "name": "swapType",
                        "type": "uint8",
                      },
                      {
                        "internalType": "address",
                        "name": "extRouter",
                        "type": "address",
                      },
                      {
                        "internalType": "bytes",
                        "name": "extCalldata",
                        "type": "bytes",
                      },
                      {
                        "internalType": "bool",
                        "name": "needScale",
                        "type": "bool",
                      },
                    ],
                    "internalType": "struct SwapData",
                    "name": "swapData",
                    "type": "tuple",
                  },
                ],
                "internalType": "struct TokenOutput",
                "name": "output",
                "type": "tuple",
              },
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "limitRouter",
                    "type": "address",
                  },
                  {
                    "internalType": "uint256",
                    "name": "epsSkipMarket",
                    "type": "uint256",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "normalFills",
                    "type": "tuple[]",
                  },
                  {
                    "components": [
                      {
                        "components": [
                          {
                            "internalType": "uint256",
                            "name": "salt",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "expiry",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "nonce",
                            "type": "uint256",
                          },
                          {
                            "internalType": "enum IPLimitOrderType.OrderType",
                            "name": "orderType",
                            "type": "uint8",
                          },
                          {
                            "internalType": "address",
                            "name": "token",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "YT",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "maker",
                            "type": "address",
                          },
                          {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address",
                          },
                          {
                            "internalType": "uint256",
                            "name": "makingAmount",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "lnImpliedRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "uint256",
                            "name": "failSafeRate",
                            "type": "uint256",
                          },
                          {
                            "internalType": "bytes",
                            "name": "permit",
                            "type": "bytes",
                          },
                        ],
                        "internalType": "struct Order",
                        "name": "order",
                        "type": "tuple",
                      },
                      {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes",
                      },
                      {
                        "internalType": "uint256",
                        "name": "makingAmount",
                        "type": "uint256",
                      },
                    ],
                    "internalType": "struct FillOrderParams[]",
                    "name": "flashFills",
                    "type": "tuple[]",
                  },
                  {
                    "internalType": "bytes",
                    "name": "optData",
                    "type": "bytes",
                  },
                ],
                "internalType": "struct LimitOrderData",
                "name": "limit",
                "type": "tuple",
              },
            ],
            "name": "withdraw",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "netTokenOut",
                "type": "uint256",
              },
            ],
            "stateMutability": "nonpayable",
            "type": "function",
          },
          {
            "stateMutability": "payable",
            "type": "receive",
          },
        ],
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
