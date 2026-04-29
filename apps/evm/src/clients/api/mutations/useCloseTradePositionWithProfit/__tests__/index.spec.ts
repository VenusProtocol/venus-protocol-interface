import { approximateOutSwapQuote, exactInSwapQuote } from '__mocks__/models/swap';
import { vLisUSD, vUsdc } from '__mocks__/models/vTokens';
import { queryClient } from 'clients/api/queryClient';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { type CloseTradePositionWithProfitInput, useCloseTradePositionWithProfit } from '..';

vi.mock('libs/contracts');

const fakeInput: CloseTradePositionWithProfitInput = {
  longVTokenAddress: vLisUSD.address,
  shortVTokenAddress: vUsdc.address,
  repaySwapQuote: {
    ...approximateOutSwapQuote,
    fromToken: vLisUSD.underlyingToken,
    toToken: vUsdc.underlyingToken,
    fromTokenAmountSoldMantissa: 49000000n,
    minimumToTokenAmountReceivedMantissa: 50000000n,
  },
  profitSwapQuote: {
    ...exactInSwapQuote,
    fromToken: vLisUSD.underlyingToken,
    toToken: vLisUSD.underlyingToken,
    fromTokenAmountSoldMantissa: 12000000n,
    minimumToTokenAmountReceivedMantissa: 11000000n,
  },
};

const fakeOptions = {
  waitForConfirmation: true,
};

describe('useCloseTradePositionWithProfit', () => {
  it('calls useSendTransaction with correct parameters', async () => {
    renderHook(() => useCloseTradePositionWithProfit(fakeOptions));

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
        "address": "0xfakeRelativePositionManagerContractAddress",
        "args": [
          "0x170d3b2da05cc2124334240fB34ad1359e34C562",
          "0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7",
          {
            "longAmountToRedeemForProfit": 12000000n,
            "longAmountToRedeemForRepay": 49000000n,
            "minAmountOutProfit": 11000000n,
            "minAmountOutRepay": 50000000n,
            "swapDataProfit": "0x",
            "swapDataRepay": "0x",
          },
        ],
        "functionName": "closeWithProfitAndDeactivate",
      }
    `,
    );

    await onConfirmed();

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(3);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "queryKey": [
              "GET_POOLS",
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_RAW_TRADE_POSITIONS",
            ],
          },
        ],
        [
          {
            "queryKey": [
              "GET_ACCOUNT_TRANSACTION_HISTORY",
            ],
          },
        ],
      ]
    `);
  });

  it('defaults repay swap values when repaySwapQuote is not provided', async () => {
    renderHook(() => useCloseTradePositionWithProfit());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(
      await fn({
        ...fakeInput,
        repaySwapQuote: undefined,
      }),
    ).toEqual({
      abi: expect.any(Array),
      address: '0xfakeRelativePositionManagerContractAddress',
      functionName: 'closeWithProfitAndDeactivate',
      args: [
        fakeInput.longVTokenAddress,
        fakeInput.shortVTokenAddress,
        {
          longAmountToRedeemForRepay: 0n,
          minAmountOutRepay: 0n,
          swapDataRepay: '0x',
          longAmountToRedeemForProfit: fakeInput.profitSwapQuote.fromTokenAmountSoldMantissa,
          minAmountOutProfit: fakeInput.profitSwapQuote.minimumToTokenAmountReceivedMantissa,
          swapDataProfit: fakeInput.profitSwapQuote.callData,
        },
      ],
    });
  });

  it('throws error when RelativePositionManager contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    renderHook(() => useCloseTradePositionWithProfit());

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
