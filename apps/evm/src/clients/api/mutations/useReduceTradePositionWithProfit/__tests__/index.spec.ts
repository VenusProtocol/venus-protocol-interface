import { approximateOutSwapQuote, exactInSwapQuote } from '__mocks__/models/swap';
import { vLisUSD, vUsdc } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import type { Mock } from 'vitest';
import { type ReduceTradePositionWithProfitInput, useReduceTradePositionWithProfit } from '..';

vi.mock('libs/contracts');

const fakeInput: ReduceTradePositionWithProfitInput = {
  longVTokenAddress: vLisUSD.address,
  shortVTokenAddress: vUsdc.address,
  closeFractionPercentage: 50,
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

describe('useReduceTradePositionWithProfit', () => {
  it('calls useSendTransaction with correct parameters', async () => {
    useReduceTradePositionWithProfit();

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toMatchSnapshot({
      abi: expect.any(Array),
    });

    const { onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];
    await onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('falls back to profitAmountMantissa when profitSwapQuote is not provided', async () => {
    useReduceTradePositionWithProfit();

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(
      await fn({
        ...fakeInput,
        profitSwapQuote: undefined,
        profitAmountMantissa: new BigNumber('12000000'),
      }),
    ).toMatchSnapshot({
      abi: expect.any(Array),
    });
  });

  it('defaults profit swap values to zero when optional profit inputs are omitted', async () => {
    useReduceTradePositionWithProfit();

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(
      await fn({
        ...fakeInput,
        profitSwapQuote: undefined,
        profitAmountMantissa: undefined,
      }),
    ).toMatchSnapshot({
      abi: expect.any(Array),
    });
  });

  it('throws error when RelativePositionManager contract address is not found', async () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    useReduceTradePositionWithProfit();

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
