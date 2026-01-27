import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { ExactOutSwapQuote, Swap, SwapQuote } from 'types';
import { convertMantissaToTokens } from 'utilities';

import TEST_IDS from './testIds';

export interface SwapSummaryProps {
  type: 'supply' | 'repay';
  swap?: Swap | SwapQuote;
}

export const SwapSummary: React.FC<SwapSummaryProps> = ({ swap, type }) => {
  const { t } = useTranslation();

  const swapSummary = useMemo(() => {
    if (!swap) {
      return undefined;
    }

    const fromTokenAmountMantissa =
      swap.direction === 'exactAmountIn' || swap.direction === 'exact-in'
        ? swap.fromTokenAmountSoldMantissa
        : (swap as ExactOutSwapQuote).expectedFromTokenAmountSoldMantissa; // TODO: type check?
    const toTokenAmountMantissa =
      swap.direction === 'exactAmountIn' || swap.direction === 'exact-in'
        ? swap.expectedToTokenAmountReceivedMantissa
        : (swap as ExactOutSwapQuote).toTokenAmountReceivedMantissa; // TODO: type check?

    const readableFromTokenAmount = convertMantissaToTokens({
      value: fromTokenAmountMantissa,
      token: swap.fromToken,
      returnInReadableFormat: true,
    });

    const readableToTokenAmount = convertMantissaToTokens({
      value: toTokenAmountMantissa,
      token: swap.toToken,
      returnInReadableFormat: true,
    });

    const args = {
      toTokenAmount: readableToTokenAmount,
      fromTokenAmount: readableFromTokenAmount,
    };

    return type === 'repay'
      ? t('operationForm.swapSummary.repay', args)
      : t('operationForm.swapSummary.supply', args);
  }, [swap, type, t]);

  if (!swap) {
    return null;
  }

  return (
    <p data-testid={TEST_IDS.swapSummary} className="text-sm text-grey text-center mt-2">
      {swapSummary}
    </p>
  );
};

export default SwapSummary;
