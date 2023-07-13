/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap } from 'types';
import {
  convertWeiToTokens,
  formatPercentageToReadableValue,
  formatTokensToReadableValue,
} from 'utilities';

import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';

import { LabeledInlineContent } from '../LabeledInlineContent';
import { useStyles } from './styles';

const readableSlippageTolerancePercentage = formatPercentageToReadableValue(
  SLIPPAGE_TOLERANCE_PERCENTAGE,
);

export interface SwapDetailsProps {
  action: 'repay' | 'supply';
  swap?: Swap;
  className?: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({ swap, action, ...containerProps }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const readableToTokenAmountReceived = useMemo(
    () =>
      swap &&
      convertWeiToTokens({
        valueWei:
          swap.direction === 'exactAmountIn'
            ? swap.expectedToTokenAmountReceivedWei
            : swap.toTokenAmountReceivedWei,
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
    [swap?.exchangeRate, swap?.toToken],
  );

  const receivedAmountLabel =
    action === 'repay'
      ? t('swapDetails.receivedAmount.repayLabel')
      : t('swapDetails.receivedAmount.supplyLabel');

  return (
    <div {...containerProps}>
      {swap && (
        <LabeledInlineContent label={t('swapDetails.exchangeRate.label')} css={styles.row}>
          {t('swapDetails.exchangeRate.value', {
            fromTokenSymbol: swap.fromToken.symbol,
            toTokenSymbol: swap.toToken.symbol,
            rate: readableExchangeRate,
          })}
        </LabeledInlineContent>
      )}

      <LabeledInlineContent label={t('swapDetails.slippageTolerance.label')} css={styles.row}>
        {readableSlippageTolerancePercentage}
      </LabeledInlineContent>

      {swap && (
        <LabeledInlineContent label={receivedAmountLabel}>
          {swap.direction === 'exactAmountIn'
            ? t('swapDetails.receivedAmount.estimatedValue', {
                value: readableToTokenAmountReceived,
              })
            : t('swapDetails.receivedAmount.exactValue', {
                value: readableToTokenAmountReceived,
              })}
        </LabeledInlineContent>
      )}
    </div>
  );
};

export default SwapDetails;
