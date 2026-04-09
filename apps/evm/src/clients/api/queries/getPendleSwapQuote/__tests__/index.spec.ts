import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { bnb, xvs } from '__mocks__/models/tokens';
import { ChainId } from 'types';
import { restService } from 'utilities';

import { getPendleSwapQuote } from '..';
import type { PendleSwapApiResponse } from '../types';

vi.mock('utilities/restService');

const fakeReceiverAddress = '0x7679f4ffc3f7e10b5dc25bf657e12567909f1c6d' as const;

const fakePendleSwapApiResponse: PendleSwapApiResponse = {
  pendleMarket: '0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5',
  method: 'swapExactTokenForPt',
  contractCallParamsName: ['receiver', 'market', 'minPtOut', 'guessPtOut', 'input', 'limit'],
  contractCallParams: [
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
  ],
  estimatedOutput: {
    token: '0xe052823b4aefc6e230faf46231a57d0905e30ae0',
    amount: '1008860197051378',
  },
  priceImpact: 0.0000012,
  impliedApy: {
    before: 0.0339809766,
    after: 0.033981,
  },
  fee: {
    usd: '0.0132',
  },
  requiredApprovals: [
    {
      token: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      amount: '1000000000000000',
    },
  ],
};

describe('getPendleSwapQuote', () => {
  beforeEach(() => {
    (restService as Mock).mockImplementation(async () => ({
      data: fakePendleSwapApiResponse,
    }));
  });

  it('returns formatted swap quote on success', async () => {
    const response = await getPendleSwapQuote({
      chainId: ChainId.BSC_MAINNET,
      fromToken: bnb,
      toToken: xvs,
      amountTokens: new BigNumber('0.001'),
      slippagePercentage: 0.5,
      receiverAddress: fakeReceiverAddress,
    });

    expect(response).toMatchInlineSnapshot(`
      {
        "contractCallParams": [
          "0x7679f4ffc3f7e10b5dc25bf657e12567909f1c6d",
          "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
          "998771595080864",
          {
            "eps": "1000000000000",
            "guessMax": "1059303206903946",
            "guessMin": "504430098525689",
            "guessOffchain": "1008860197051378",
            "maxIteration": "30",
          },
          {
            "netTokenIn": "1000000000000000",
            "pendleSwap": "0x0000000000000000000000000000000000000000",
            "swapData": {
              "extCalldata": "0x",
              "extRouter": "0x0000000000000000000000000000000000000000",
              "needScale": false,
              "swapType": "0",
            },
            "tokenIn": "0x0000000000000000000000000000000000000000",
            "tokenMintSy": "0x0000000000000000000000000000000000000000",
          },
          {
            "epsSkipMarket": "0",
            "flashFills": [],
            "limitRouter": "0x0000000000000000000000000000000000000000",
            "normalFills": [],
            "optData": "0x",
          },
        ],
        "contractCallParamsName": [
          "receiver",
          "market",
          "minPtOut",
          "guessPtOut",
          "input",
          "limit",
        ],
        "estimatedReceivedTokensMantissa": "1008860197051378",
        "feeCents": "1.32",
        "pendleMarketAddress": "0x3c1a3d6b69a866444fe506f7d38a00a1c2d859c5",
        "priceImpactPercentage": 0.0000012,
        "requiredApprovals": [
          {
            "amount": "1000000000000000",
            "token": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          },
        ],
      }
    `);
  });

  it('calls restService with correct params', async () => {
    await getPendleSwapQuote({
      chainId: ChainId.BSC_MAINNET,
      fromToken: bnb,
      toToken: xvs,
      amountTokens: new BigNumber('0.001'),
      slippagePercentage: 0.5,
      receiverAddress: fakeReceiverAddress,
    });

    expect(restService).toHaveBeenCalledTimes(1);
    expect(restService).toHaveBeenCalledWith({
      endpoint: '/pendle/swap-calldata',
      method: 'GET',
      params: {
        chainId: ChainId.BSC_MAINNET,
        tokenInAddress: bnb.address,
        tokenOutAddress: xvs.address,
        amountInMantissa: expect.any(BigNumber),
        slippagePercentage: 0.5,
        receiverAddress: fakeReceiverAddress,
      },
    });
  });

  it('throws when response data is empty', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: undefined,
    }));

    await expect(
      getPendleSwapQuote({
        chainId: ChainId.BSC_MAINNET,
        fromToken: bnb,
        toToken: xvs,
        amountTokens: new BigNumber('0.001'),
        slippagePercentage: 0.5,
      }),
    ).rejects.toThrow('somethingWentWrong');
  });

  it('throws when response contains an error', async () => {
    (restService as Mock).mockImplementation(async () => ({
      data: { error: '0.01', code: 'PENDLE_AMOUNT_TOO_LOW' },
    }));

    await expect(
      getPendleSwapQuote({
        chainId: ChainId.BSC_MAINNET,
        fromToken: bnb,
        toToken: xvs,
        amountTokens: new BigNumber('0.00001'),
        slippagePercentage: 0.5,
      }),
    ).rejects.toThrow('PENDLE_AMOUNT_TOO_LOW');
  });
});
