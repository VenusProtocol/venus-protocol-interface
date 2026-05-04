import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { FULL_REPAYMENT_BUFFER_PERCENTAGE } from 'constants/fullRepaymentBuffer';
import type { ChainId, SwapQuote, Token } from 'types';
import { convertMantissaToTokens, getSwapToTokenAmount } from 'utilities';
import { getSwapQuote } from '../getSwapQuote';

export interface GetTradeReduceSwapQuotesInput {
  chainId: ChainId;
  leverageManagerContractAddress: Address;
  relativePositionManagerContractAddress: Address;
  dsaToken: Token;
  shortToken: Token;
  shortAmountToRepayTokens: BigNumber;
  longToken: Token;
  longAmountToWithdrawTokens: BigNumber;
  closeFractionPercentage: number;
  isPositionShortBalanceZero: boolean;
  slippagePercentage: number;
}

export type GetTradeReduceSwapQuotesOutput = {
  pnlDsaTokens: BigNumber;
  repayWithProfitSwapQuote?: SwapQuote;
  repayWithLossSwapQuote?: SwapQuote;
  profitSwapQuote?: SwapQuote;
  lossSwapQuote?: SwapQuote;
};

export const getTradeReduceSwapQuotes = async ({
  chainId,
  dsaToken,
  shortToken,
  shortAmountToRepayTokens,
  longToken,
  longAmountToWithdrawTokens,
  closeFractionPercentage,
  isPositionShortBalanceZero,
  slippagePercentage,
  leverageManagerContractAddress,
  relativePositionManagerContractAddress,
}: GetTradeReduceSwapQuotesInput): Promise<GetTradeReduceSwapQuotesOutput> => {
  const shareSwapQuoteInput = {
    chainId,
    recipientAddress: leverageManagerContractAddress,
    slippagePercentage,
  };

  let cappedLongAmountToWithdrawTokens = longAmountToWithdrawTokens;

  if (closeFractionPercentage === 100) {
    // Buff down amount when fully reducing a position to make sure we don't try to withdraw more
    // than the available long balance. TODO: check if this code is still necessary after the
    // backend updates
    cappedLongAmountToWithdrawTokens = cappedLongAmountToWithdrawTokens.multipliedBy(
      new BigNumber(1).minus(FULL_REPAYMENT_BUFFER_PERCENTAGE),
    );
  }

  const [getRepayWithProfitSwapQuoteData, getRepayWithLossSwapQuoteData] = await Promise.all([
    // Repay (repay short using long) swap quote, in the case of a profit
    shortAmountToRepayTokens.isGreaterThan(0)
      ? getSwapQuote({
          ...shareSwapQuoteInput,
          fromToken: longToken,
          toToken: shortToken,
          minToTokenAmountTokens: shortAmountToRepayTokens.multipliedBy(
            // Buff amount to account from accrued interests while the transaction is being mined
            new BigNumber(1).plus(FULL_REPAYMENT_BUFFER_PERCENTAGE),
          ),
          direction: 'approximate-out',
        })
      : undefined,
    // Repay (repay short using long) swap quote, in the case of a loss
    cappedLongAmountToWithdrawTokens.isGreaterThan(0)
      ? getSwapQuote({
          ...shareSwapQuoteInput,
          fromToken: longToken,
          fromTokenAmountTokens: cappedLongAmountToWithdrawTokens,
          toToken: shortToken,
          direction: 'exact-in',
        })
      : undefined,
  ]);

  const repayWithProfitSwapQuote = getRepayWithProfitSwapQuoteData?.swapQuote;

  const repayWithProfitSwapQuoteFromTokenAmountTokens =
    repayWithProfitSwapQuote?.direction === 'approximate-out'
      ? convertMantissaToTokens({
          value: repayWithProfitSwapQuote.fromTokenAmountSoldMantissa,
          token: repayWithProfitSwapQuote.fromToken,
        })
      : undefined;

  // If longProfitAmountDeltaTokens is positive, then it means there's a profit
  let longProfitAmountDeltaTokens: BigNumber | undefined;

  if (isPositionShortBalanceZero) {
    // If the position has an empty short balance, then the leftover long is pure profit
    longProfitAmountDeltaTokens = longAmountToWithdrawTokens;
  } else {
    // Otherwise the profit is based on the amount of extra long tokens obtained after repaying the
    // short balance
    longProfitAmountDeltaTokens =
      repayWithProfitSwapQuoteFromTokenAmountTokens &&
      longAmountToWithdrawTokens.minus(repayWithProfitSwapQuoteFromTokenAmountTokens);
  }

  const repayWithLossSwapQuote = getRepayWithLossSwapQuoteData?.swapQuote;

  const repayWithLossSwapQuoteMinToTokenAmountTokens =
    repayWithLossSwapQuote?.direction === 'exact-in'
      ? convertMantissaToTokens({
          value: repayWithLossSwapQuote.minimumToTokenAmountReceivedMantissa,
          token: repayWithLossSwapQuote.toToken,
        })
      : undefined;

  // If shortLossAmountDeltaTokens is positive, then it means there's a loss
  const shortLossAmountDeltaTokens =
    repayWithLossSwapQuoteMinToTokenAmountTokens &&
    shortAmountToRepayTokens.minus(repayWithLossSwapQuoteMinToTokenAmountTokens);

  let profitSwapQuote: SwapQuote | undefined;
  let lossSwapQuote: SwapQuote | undefined;

  if (longProfitAmountDeltaTokens?.isGreaterThan(0)) {
    // Profit swap quote (swap extra long to supply DSA = generate profit)
    const { swapQuote } = await getSwapQuote({
      ...shareSwapQuoteInput,
      fromToken: longToken,
      fromTokenAmountTokens: longProfitAmountDeltaTokens,
      toToken: dsaToken,
      direction: 'exact-in',
      // When closing with a profit, the long assets need to be transferred to the
      // RelativePositionManager contract
      recipientAddress: relativePositionManagerContractAddress,
    });

    profitSwapQuote = swapQuote;
  } else if (shortLossAmountDeltaTokens?.isGreaterThan(0)) {
    // Loss swap quote (swap DSA to repay short = repay loss)
    const { swapQuote } = await getSwapQuote({
      ...shareSwapQuoteInput,
      fromToken: dsaToken,
      toToken: shortToken,
      minToTokenAmountTokens: shortLossAmountDeltaTokens.multipliedBy(
        // Buff amount to account for accrued interests while the transaction is being mined
        new BigNumber(1).plus(FULL_REPAYMENT_BUFFER_PERCENTAGE),
      ),
      direction: 'approximate-out',
    });

    lossSwapQuote = swapQuote;
  }

  // Calculate actual PnL based on swaps
  let pnlDsaTokens = new BigNumber(0);

  // Closing/Reducing with profit
  if (profitSwapQuote?.direction === 'exact-in') {
    pnlDsaTokens = getSwapToTokenAmount(profitSwapQuote);
  }
  // Closing/Reducing with loss
  else if (lossSwapQuote?.direction === 'approximate-out') {
    pnlDsaTokens = convertMantissaToTokens({
      value: lossSwapQuote.fromTokenAmountSoldMantissa,
      token: lossSwapQuote.fromToken,
    }).multipliedBy(-1);
  }

  return {
    pnlDsaTokens,
    repayWithProfitSwapQuote,
    repayWithLossSwapQuote,
    profitSwapQuote,
    lossSwapQuote,
  };
};
