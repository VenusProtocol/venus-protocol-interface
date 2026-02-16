import { useMemo } from 'react';

import { cn } from '@venusprotocol/ui';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import {
  DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
} from 'constants/swap';
import { useTranslation } from 'libs/translations';
import type { Swap } from 'types';
import {
  convertMantissaToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { LabeledInlineContent } from 'components';

const readableSlippageTolerancePercentage = formatPercentageToReadableValue(
  DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
);

export interface SwapDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  swap?: Swap;
  className?: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({ swap, className, ...otherProps }) => {
  const { t } = useTranslation();

  const readableFromTokenAmountSold = useMemo(
    () =>
      swap &&
      convertMantissaToTokens({
        value:
          swap.direction === 'exactAmountIn'
            ? swap.fromTokenAmountSoldMantissa
            : swap.maximumFromTokenAmountSoldMantissa,
        token: swap.fromToken,
        returnInReadableFormat: true,
      }),
    [swap],
  );

  const readableToTokenAmountReceived = useMemo(
    () =>
      swap &&
      convertMantissaToTokens({
        value:
          swap.direction === 'exactAmountIn'
            ? swap.expectedToTokenAmountReceivedMantissa
            : swap.toTokenAmountReceivedMantissa,
        token: swap.toToken,
        returnInReadableFormat: true,
      }),
    [swap],
  );

  const readableExchangeRate = useMemo(
    () =>
      swap &&
      formatTokensToReadableValue({
        value: swap.exchangeRate,
        token: swap.toToken,
        addSymbol: false,
      }),
    [swap],
  );

  const getLastLineLabel = () => {
    if (!swap) {
      return PLACEHOLDER_KEY;
    }

    return swap.direction === 'exactAmountIn'
      ? t('swap.swapDetails.label.minimumReceived')
      : t('swap.swapDetails.label.maximumSold');
  };

  const getLastLineValue = () => {
    if (!swap) {
      return PLACEHOLDER_KEY;
    }

    return t('swap.swapDetails.value.exactAmount', {
      value:
        swap.direction === 'exactAmountIn'
          ? readableToTokenAmountReceived
          : readableFromTokenAmountSold,
    });
  };

  const readablePriceImpact = useMemo(
    () => swap && formatPercentageToReadableValue(swap.priceImpactPercentage),
    [swap],
  );

  return (
    <div className={cn('space-y-2', className)} {...otherProps}>
      {swap && (
        <LabeledInlineContent label={t('swap.swapDetails.label.exchangeRate')}>
          {t('swap.swapDetails.value.exchangeRate', {
            fromTokenSymbol: swap.fromToken.symbol,
            toTokenSymbol: swap.toToken.symbol,
            rate: readableExchangeRate,
          })}
        </LabeledInlineContent>
      )}

      <LabeledInlineContent label={t('swap.swapDetails.label.slippageTolerance')}>
        {readableSlippageTolerancePercentage}
      </LabeledInlineContent>

      {swap && (
        <>
          <LabeledInlineContent
            label={t('swap.swapDetails.label.priceImpact')}
            tooltip={t('swap.swapDetails.tooltip.priceImpact')}
          >
            <span
              className={cn(
                swap.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE && 'text-red',
              )}
            >
              {t('swap.swapDetails.value.priceImpact', { priceImpact: readablePriceImpact })}
            </span>
          </LabeledInlineContent>

          <LabeledInlineContent label={getLastLineLabel()}>
            {getLastLineValue()}
          </LabeledInlineContent>
        </>
      )}
    </div>
  );
};

export default SwapDetails;
