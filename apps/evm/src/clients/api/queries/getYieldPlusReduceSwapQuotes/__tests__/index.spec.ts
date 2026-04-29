import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAddress, { altAddress } from '__mocks__/models/address';
import { busd, usdc, usdt } from '__mocks__/models/tokens';
import { ChainId, type SwapQuote, type Token } from 'types';
import { getYieldPlusReduceSwapQuotes } from '..';
import { getSwapQuote } from '../../getSwapQuote';

vi.mock('../../getSwapQuote', () => ({
  getSwapQuote: vi.fn(),
}));

const makeApproximateOutSwapQuote = ({
  fromToken,
  toToken,
  fromTokenAmountSoldMantissa,
  minimumToTokenAmountReceivedMantissa,
}: {
  fromToken: Token;
  toToken: Token;
  fromTokenAmountSoldMantissa: bigint;
  minimumToTokenAmountReceivedMantissa: bigint;
}): SwapQuote => ({
  fromToken,
  toToken,
  direction: 'approximate-out',
  callData: '0xfakeCallData',
  priceImpactPercentage: 1,
  fromTokenAmountSoldMantissa,
  expectedToTokenAmountReceivedMantissa: minimumToTokenAmountReceivedMantissa,
  minimumToTokenAmountReceivedMantissa,
});

const makeExactInSwapQuote = ({
  fromToken,
  toToken,
  fromTokenAmountSoldMantissa,
  minimumToTokenAmountReceivedMantissa,
}: {
  fromToken: Token;
  toToken: Token;
  fromTokenAmountSoldMantissa: bigint;
  minimumToTokenAmountReceivedMantissa: bigint;
}): SwapQuote => ({
  fromToken,
  toToken,
  direction: 'exact-in',
  callData: '0xfakeCallData',
  priceImpactPercentage: 1,
  fromTokenAmountSoldMantissa,
  expectedToTokenAmountReceivedMantissa: minimumToTokenAmountReceivedMantissa,
  minimumToTokenAmountReceivedMantissa,
});

const sharedInput = {
  chainId: ChainId.BSC_MAINNET,
  leverageManagerContractAddress: fakeAddress,
  relativePositionManagerContractAddress: altAddress,
  dsaToken: usdt,
  shortToken: usdc,
  shortAmountToRepayTokens: new BigNumber(5),
  longToken: busd,
  longAmountToWithdrawTokens: new BigNumber(10),
  isPositionShortBalanceZero: false,
  slippagePercentage: 0.5,
} as const;

describe('getYieldPlusReduceSwapQuotes', () => {
  it('buffers the withdrawn long amount when fully closing the position', async () => {
    (getSwapQuote as Mock)
      .mockResolvedValueOnce({
        swapQuote: makeApproximateOutSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 10_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      })
      .mockResolvedValueOnce({
        swapQuote: makeExactInSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 9_990_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      });

    await getYieldPlusReduceSwapQuotes({
      ...sharedInput,
      closeFractionPercentage: 100,
    });

    expect(getSwapQuote).toHaveBeenCalledTimes(2);
    expect(
      ((getSwapQuote as Mock).mock.calls[1][0].fromTokenAmountTokens as BigNumber).toFixed(),
    ).toBe('9.99');
  });

  it('routes remaining long profit to the relative position manager and returns positive pnl', async () => {
    (getSwapQuote as Mock)
      .mockResolvedValueOnce({
        swapQuote: makeApproximateOutSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 3_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      })
      .mockResolvedValueOnce({
        swapQuote: makeExactInSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 10_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      })
      .mockResolvedValueOnce({
        swapQuote: makeExactInSwapQuote({
          fromToken: busd,
          toToken: usdt,
          fromTokenAmountSoldMantissa: 7_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 2_000_000n,
        }),
      });

    const result = await getYieldPlusReduceSwapQuotes({
      ...sharedInput,
      closeFractionPercentage: 50,
    });

    expect(getSwapQuote).toHaveBeenCalledTimes(3);
    expect((getSwapQuote as Mock).mock.calls[2][0]).toMatchObject({
      recipientAddress: altAddress,
      fromToken: busd,
      toToken: usdt,
      direction: 'exact-in',
    });
    expect(
      ((getSwapQuote as Mock).mock.calls[2][0].fromTokenAmountTokens as BigNumber).toFixed(),
    ).toBe('7');
    expect(result.pnlDsaTokens.toFixed()).toBe('2');
    expect(result.profitSwapQuote?.direction).toBe('exact-in');
  });

  it('fetches a loss swap quote and returns negative pnl when the repaid short is insufficient', async () => {
    (getSwapQuote as Mock)
      .mockResolvedValueOnce({
        swapQuote: makeApproximateOutSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 10_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      })
      .mockResolvedValueOnce({
        swapQuote: makeExactInSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 10_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 4_000_000n,
        }),
      })
      .mockResolvedValueOnce({
        swapQuote: makeApproximateOutSwapQuote({
          fromToken: usdt,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 1_500_000n,
          minimumToTokenAmountReceivedMantissa: 1_001_000n,
        }),
      });

    const result = await getYieldPlusReduceSwapQuotes({
      ...sharedInput,
      closeFractionPercentage: 50,
    });

    expect(getSwapQuote).toHaveBeenCalledTimes(3);
    expect((getSwapQuote as Mock).mock.calls[2][0]).toMatchObject({
      fromToken: usdt,
      toToken: usdc,
      direction: 'approximate-out',
      recipientAddress: fakeAddress,
    });
    expect(
      ((getSwapQuote as Mock).mock.calls[2][0].minToTokenAmountTokens as BigNumber).toFixed(),
    ).toBe('1.001');
    expect(result.pnlDsaTokens.toFixed()).toBe('-1.5');
    expect(result.lossSwapQuote?.direction).toBe('approximate-out');
  });

  it('returns zero pnl without profit or loss swap quotes when long fully covers the repay amount', async () => {
    (getSwapQuote as Mock)
      .mockResolvedValueOnce({
        swapQuote: makeApproximateOutSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 10_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      })
      .mockResolvedValueOnce({
        swapQuote: makeExactInSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 10_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      });

    const result = await getYieldPlusReduceSwapQuotes({
      ...sharedInput,
      closeFractionPercentage: 50,
    });

    expect(getSwapQuote).toHaveBeenCalledTimes(2);
    expect(result.pnlDsaTokens.toFixed()).toBe('0');
    expect(result.profitSwapQuote).toBeUndefined();
    expect(result.lossSwapQuote).toBeUndefined();
  });

  it('treats withdrawn long as pure profit when the position short balance is already zero', async () => {
    (getSwapQuote as Mock)
      .mockResolvedValueOnce({
        swapQuote: makeApproximateOutSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 0n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      })
      .mockResolvedValueOnce({
        swapQuote: makeExactInSwapQuote({
          fromToken: busd,
          toToken: usdc,
          fromTokenAmountSoldMantissa: 10_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 5_000_000n,
        }),
      })
      .mockResolvedValueOnce({
        swapQuote: makeExactInSwapQuote({
          fromToken: busd,
          toToken: usdt,
          fromTokenAmountSoldMantissa: 10_000_000_000_000_000_000n,
          minimumToTokenAmountReceivedMantissa: 3_000_000n,
        }),
      });

    const result = await getYieldPlusReduceSwapQuotes({
      ...sharedInput,
      isPositionShortBalanceZero: true,
      closeFractionPercentage: 100,
    });

    expect(getSwapQuote).toHaveBeenCalledTimes(3);
    expect((getSwapQuote as Mock).mock.calls[2][0]).toMatchObject({
      recipientAddress: altAddress,
      fromToken: busd,
      toToken: usdt,
      direction: 'exact-in',
    });
    expect(
      ((getSwapQuote as Mock).mock.calls[2][0].fromTokenAmountTokens as BigNumber).toFixed(),
    ).toBe('10');
    expect(result.pnlDsaTokens.toFixed()).toBe('3');
  });
});
