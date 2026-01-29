import BigNumber from 'bignumber.js';
import type { Address } from 'viem';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { busd, usdc } from '__mocks__/models/tokens';
import { ChainId } from 'types';
import { restService } from 'utilities';
import { getSwapQuote } from '..';
import type { SwapApiResponse } from '../types';

vi.mock('utilities/restService');
vi.mock('utilities/generateTransactionDeadline');

const sharedProps = {
  chainId: ChainId.BSC_MAINNET,
  fromToken: usdc,
  toToken: busd,
  slippagePercentage: 0.5,
  recipientAddress: fakeAddress as Address,
};

const fakeApiResponse: SwapApiResponse = {
  quotes: [
    {
      amountIn: '1000000',
      amountInMax: '1000000',
      amountOut: '1000000000000000000',
      amountOutMin: '9789746164978756079',
      protocol: 'Fake Protocol',
      priceImpact: 0.8,
      swapHelperMulticall: {
        target: '0xfakeSwapHelperMulticall',
        calldata: {
          encodedCall: '0xfakeEncodedCallData',
        },
      },
    },
  ],
};

describe('getSwapQuote', () => {
  beforeEach(() => {
    (restService as Mock).mockResolvedValue({ data: fakeApiResponse });
  });

  it('fetches and formats "exact-in" swap quote correctly', async () => {
    const result = await getSwapQuote({
      ...sharedProps,
      direction: 'exact-in',
      fromTokenAmountTokens: new BigNumber(1),
    });

    expect(restService).toHaveBeenCalledTimes(1);
    expect((restService as Mock).mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "endpoint": "/find-swap",
        "method": "GET",
        "params": {
          "chainId": 56,
          "deadlineTimestampSecs": 1747386407,
          "exactAmountInMantissa": "1000000",
          "recipientAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          "shouldTransferToReceiver": true,
          "slippagePercentage": 0.005,
          "tokenInAddress": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
          "tokenOutAddress": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
          "type": "exact-in",
        },
      }
    `);

    expect(result).toMatchInlineSnapshot(`
      {
        "swapQuote": {
          "callData": "0xfakeEncodedCallData",
          "direction": "exact-in",
          "expectedToTokenAmountReceivedMantissa": 1000000000000000000n,
          "fromToken": {
            "address": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
            "chainId": 97,
            "decimals": 6,
            "iconSrc": "fake-usdc-asset",
            "symbol": "USDC",
          },
          "fromTokenAmountSoldMantissa": 1000000n,
          "minimumToTokenAmountReceivedMantissa": 999950000000000000n,
          "priceImpactPercentage": 80,
          "toToken": {
            "address": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-busd-asset",
            "symbol": "BUSD",
          },
        },
      }
    `);
  });

  it('fetches and formats "exact-out" swap quote correctly', async () => {
    const result = await getSwapQuote({
      ...sharedProps,
      direction: 'exact-out',
      toTokenAmountTokens: new BigNumber(1),
    });

    expect(restService).toHaveBeenCalledTimes(1);
    expect((restService as Mock).mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "endpoint": "/find-swap",
        "method": "GET",
        "params": {
          "chainId": 56,
          "deadlineTimestampSecs": 1747386407,
          "exactAmountOutMantissa": "1000000000000000000",
          "recipientAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          "shouldTransferToReceiver": true,
          "slippagePercentage": 0.005,
          "tokenInAddress": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
          "tokenOutAddress": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
          "type": "exact-out",
        },
      }
    `);

    expect(result).toMatchInlineSnapshot(`
      {
        "swapQuote": {
          "callData": "0xfakeEncodedCallData",
          "direction": "exact-out",
          "expectedFromTokenAmountSoldMantissa": 1000000n,
          "fromToken": {
            "address": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
            "chainId": 97,
            "decimals": 6,
            "iconSrc": "fake-usdc-asset",
            "symbol": "USDC",
          },
          "maximumFromTokenAmountSoldMantissa": 1000050n,
          "priceImpactPercentage": 80,
          "toToken": {
            "address": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-busd-asset",
            "symbol": "BUSD",
          },
          "toTokenAmountReceivedMantissa": 1000000000000000000n,
        },
      }
    `);
  });

  it('fetches and formats "approximate-out" swap quote correctly', async () => {
    const result = await getSwapQuote({
      ...sharedProps,
      direction: 'approximate-out',
      minToTokenAmountTokens: new BigNumber(1),
    });

    expect(restService).toHaveBeenCalledTimes(1);
    expect((restService as Mock).mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "endpoint": "/find-swap",
        "method": "GET",
        "params": {
          "chainId": 56,
          "deadlineTimestampSecs": 1747386407,
          "minAmountOutMantissa": "1000000000000000000",
          "recipientAddress": "0x3d759121234cd36F8124C21aFe1c6852d2bEd848",
          "shouldTransferToReceiver": true,
          "slippagePercentage": 0.005,
          "tokenInAddress": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
          "tokenOutAddress": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
          "type": "approximate-out",
        },
      }
    `);

    expect(result).toMatchInlineSnapshot(`
      {
        "swapQuote": {
          "callData": "0xfakeEncodedCallData",
          "direction": "approximate-out",
          "expectedToTokenAmountReceivedMantissa": 1000000000000000000n,
          "fromToken": {
            "address": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
            "chainId": 97,
            "decimals": 6,
            "iconSrc": "fake-usdc-asset",
            "symbol": "USDC",
          },
          "fromTokenAmountSoldMantissa": 1000000n,
          "minimumToTokenAmountReceivedMantissa": 1000000000000000000n,
          "priceImpactPercentage": 80,
          "toToken": {
            "address": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-busd-asset",
            "symbol": "BUSD",
          },
        },
      }
    `);
  });

  it('throws on error in payload', async () => {
    (restService as Mock).mockResolvedValue({ data: { error: 'Some error' } });

    await expect(
      getSwapQuote({
        ...sharedProps,
        direction: 'approximate-out',
        minToTokenAmountTokens: new BigNumber(1),
      }),
    ).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws on undefined payload', async () => {
    (restService as Mock).mockResolvedValue({ data: undefined });

    await expect(
      getSwapQuote({
        ...sharedProps,
        direction: 'approximate-out',
        minToTokenAmountTokens: new BigNumber(1),
      }),
    ).rejects.toMatchObject({
      code: 'somethingWentWrong',
    });
  });

  it('throws on empty quotes array', async () => {
    (restService as Mock).mockResolvedValue({
      data: {
        quotes: [],
      },
    });

    await expect(
      getSwapQuote({
        ...sharedProps,
        direction: 'approximate-out',
        minToTokenAmountTokens: new BigNumber(1),
      }),
    ).rejects.toMatchObject({
      code: 'noSwapQuoteFound',
    });
  });
});
