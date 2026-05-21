import { approximateOutSwapQuote, exactInSwapQuote } from '__mocks__/models/swap';
import { vLisUSD, vUsdc } from '__mocks__/models/vTokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import type { Mock } from 'vitest';

import { type ReduceTradePositionWithLossInput, useReduceTradePositionWithLoss } from '..';

vi.mock('libs/contracts');

const fakeInput: ReduceTradePositionWithLossInput = {
  longVTokenAddress: vLisUSD.address,
  shortVTokenAddress: vUsdc.address,
  closeFractionPercentage: 50,
  repaySwapQuote: {
    ...exactInSwapQuote,
    fromToken: vLisUSD.underlyingToken,
    toToken: vUsdc.underlyingToken,
    fromTokenAmountSoldMantissa: 49000000n,
    minimumToTokenAmountReceivedMantissa: 50000000n,
  },
  lossSwapQuote: {
    ...approximateOutSwapQuote,
    fromToken: vLisUSD.underlyingToken,
    toToken: vUsdc.underlyingToken,
    fromTokenAmountSoldMantissa: 14000000n,
    minimumToTokenAmountReceivedMantissa: 13000000n,
  },
};

describe('useReduceTradePositionWithLoss', () => {
  it('calls useSendTransaction with correct parameters when lossSwapQuote is provided', () => {
    useReduceTradePositionWithLoss();

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: undefined,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn(fakeInput)).toMatchSnapshot({
      abi: expect.any(Array),
    });

    onConfirmed();

    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();
  });

  it('falls back to repayShortAmountMantissa when lossSwapQuote is not provided', () => {
    useReduceTradePositionWithLoss();

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(
      fn({
        ...fakeInput,
        lossSwapQuote: undefined,
        repayShortAmountMantissa: new BigNumber('12000000'),
      }),
    ).toMatchSnapshot({
      abi: expect.any(Array),
    });
  });

  it('defaults second swap parameters to zero values when optional loss inputs are omitted', () => {
    useReduceTradePositionWithLoss();

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(
      fn({
        ...fakeInput,
        lossSwapQuote: undefined,
        repayShortAmountMantissa: undefined,
      }),
    ).toMatchSnapshot({
      abi: expect.any(Array),
    });
  });

  it('throws error when RelativePositionManager contract address is not found', () => {
    (useGetContractAddress as Mock).mockImplementation(() => ({ address: undefined }));

    useReduceTradePositionWithLoss();

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(() => fn(fakeInput)).toThrow('somethingWentWrong');
  });
});
