import fakeAccountAddress, {
  altAddress as fakePoolComptrollerAddress,
} from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';

import { useWithdrawAtMaturityFromPendleVault } from '..';

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

const fakeAmountToken = new BigNumber('100000000');

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

const mockCaptureAnalyticEvent = vi.fn();

describe('useWithdrawAtMaturityFromPendleVault', () => {
  beforeEach(() => {
    mockCaptureAnalyticEvent.mockClear();

    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));
  });

  it('calls useSendTransaction with the correct parameters for redeemAtMaturity', async () => {
    renderHook(
      () =>
        useWithdrawAtMaturityFromPendleVault(
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

    const redeemInput = {
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
      vToken: fakeVToken,
    };

    expect(fn(redeemInput)).toMatchObject({
      address: '0xfakePendlePtVaultContractAddress',
      functionName: 'redeemAtMaturity',
      args: [
        fakePendleMarketAddress,
        100000000n,
        {
          tokenOut: NULL_ADDRESS,
          minTokenOut: 0n,
          tokenRedeemSy: NULL_ADDRESS,
          pendleSwap: NULL_ADDRESS,
          swapData: {
            extCalldata: '0x',
            extRouter: NULL_ADDRESS,
            needScale: false,
            swapType: 0,
          },
        },
      ],
    });

    await onConfirmed({ input: redeemInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Pendle vault redeemAtMaturity",
        {
          "fromTokenAmountTokens": 1,
          "fromTokenSymbol": "XVS",
          "pendleMarketAddress": "0x1234567890abcdef1234567890abcdef12345678",
          "priceImpactPercentage": 0,
          "slippageTolerancePercentage": 0,
          "toTokenAmountTokens": 1,
          "toTokenSymbol": "BNB",
        },
      ]
    `);

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_POOLS],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_FIXED_RATED_VAULTS],
    });
  });

  it('does not require vToken to build the transaction', async () => {
    renderHook(
      () =>
        useWithdrawAtMaturityFromPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const redeemInput = {
      fromToken: fakeFromToken,
      toToken: {
        ...fakeToToken,
        isNative: false,
      },
      amountMantissa: fakeAmountToken,
    };

    expect(fn(redeemInput)).toMatchObject({
      args: [
        fakePendleMarketAddress,
        100000000n,
        expect.objectContaining({
          tokenOut: fakeToToken.address,
        }),
      ],
    });
  });

  it('tracks zero token amounts on confirmation when vToken is not provided', async () => {
    renderHook(
      () =>
        useWithdrawAtMaturityFromPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    const redeemInput = {
      fromToken: fakeFromToken,
      toToken: {
        ...fakeToToken,
        isNative: false,
      },
      amountMantissa: fakeAmountToken,
    };

    await onConfirmed({ input: redeemInput });

    expect(mockCaptureAnalyticEvent.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "Pendle vault redeemAtMaturity",
        {
          "fromTokenAmountTokens": 0,
          "fromTokenSymbol": "XVS",
          "pendleMarketAddress": "0x1234567890abcdef1234567890abcdef12345678",
          "priceImpactPercentage": 0,
          "slippageTolerancePercentage": 0,
          "toTokenAmountTokens": 0,
          "toTokenSymbol": "BNB",
        },
      ]
    `);
  });

  it('throws when pendle market address is missing', async () => {
    renderHook(
      () =>
        useWithdrawAtMaturityFromPendleVault(
          {
            pendleMarketAddress: NULL_ADDRESS,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const redeemInput = {
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
    };

    expect(() => fn(redeemInput)).toThrow('somethingWentWrong');
  });

  it('throws when contract address could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(
      () =>
        useWithdrawAtMaturityFromPendleVault(
          {
            pendleMarketAddress: fakePendleMarketAddress,
          },
          fakeOptions,
        ),
      { accountAddress: fakeAccountAddress },
    );

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const redeemInput = {
      fromToken: fakeFromToken,
      toToken: fakeToToken,
      amountMantissa: fakeAmountToken,
      vToken: fakeVToken,
    };

    expect(() => fn(redeemInput)).toThrow('somethingWentWrong');
  });
});
