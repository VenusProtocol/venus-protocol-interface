import { useMemo } from 'react';

import {
  HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE,
  SLIPPAGE_TOLERANCE_PERCENTAGE,
} from 'constants/swap';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import useFormatTokensToReadableValue from 'hooks/useFormatTokensToReadableValue';
import { useTranslation } from 'libs/translations';
import type { Swap } from 'types';
import { cn, formatPercentageToReadableValue } from 'utilities';

import { LabeledInlineContent, SecondaryAccordion } from 'components';

const readableSlippageTolerancePercentage = formatPercentageToReadableValue(
  SLIPPAGE_TOLERANCE_PERCENTAGE,
);

export interface SwapDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  action: 'repay' | 'supply';
  swap: Swap;
  className?: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({ swap, action, ...otherProps }) => {
  const { t } = useTranslation();

  const readableToTokenAmountReceived = useConvertMantissaToReadableTokenString({
    value:
      swap.direction === 'exactAmountIn'
        ? swap.expectedToTokenAmountReceivedMantissa
        : swap.toTokenAmountReceivedMantissa,
    token: swap.toToken,
  });

  const readableExchangeRate = useFormatTokensToReadableValue({
    value: swap.exchangeRate,
    token: swap.toToken,
    addSymbol: false,
  });

  const getAccordionTitle = () => {
    if (action === 'repay') {
      return swap.direction === 'exactAmountIn'
        ? t('operationForm.swapDetails.value.estimatedAmount', {
            value: readableToTokenAmountReceived,
          })
        : t('operationForm.swapDetails.value.exactAmount', {
            value: readableToTokenAmountReceived,
          });
    }

    return t('operationForm.swapDetails.value.estimatedAmount', {
      value: readableToTokenAmountReceived,
    });
  };

  const readablePriceImpact = useMemo(
    () => swap && formatPercentageToReadableValue(swap.priceImpactPercentage),
    [swap],
  );

  return (
    <SecondaryAccordion
      title={
        action === 'repay'
          ? t('operationForm.swapDetails.label.repay')
          : t('operationForm.swapDetails.label.supply')
      }
      rightLabel={getAccordionTitle()}
      {...otherProps}
    >
      <div className="space-y-2">
        <LabeledInlineContent label={t('operationForm.swapDetails.label.exchangeRate')}>
          {t('operationForm.swapDetails.value.exchangeRate', {
            fromTokenSymbol: swap.fromToken.symbol,
            toTokenSymbol: swap.toToken.symbol,
            rate: readableExchangeRate,
          })}
        </LabeledInlineContent>

        <LabeledInlineContent label={t('operationForm.swapDetails.label.slippageTolerance')}>
          {readableSlippageTolerancePercentage}
        </LabeledInlineContent>

        <LabeledInlineContent
          label={t('operationForm.swapDetails.label.priceImpact')}
          tooltip={t('operationForm.swapDetails.tooltip.priceImpact')}
        >
          <span
            className={cn(
              swap.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE && 'text-red',
            )}
          >
            {t('operationForm.swapDetails.value.priceImpact', {
              priceImpact: readablePriceImpact,
            })}
          </span>
        </LabeledInlineContent>
      </div>
    </SecondaryAccordion>
  );
};

export default SwapDetails;
