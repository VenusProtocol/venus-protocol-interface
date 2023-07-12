/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap } from 'types';
import {
  convertWeiToTokens,
  formatToReadablePercentage,
  formatTokensToReadableValue,
} from 'utilities';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';

import { LabeledInlineContent } from '../LabeledInlineContent';
import { useStyles } from './styles';

const readableSlippageTolerancePercentage = formatToReadablePercentage(
  SLIPPAGE_TOLERANCE_PERCENTAGE,
);

export interface SwapDetailsProps {
  action: 'repay' | 'supply' | 'swap';
  swap?: Swap;
  className?: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({ swap, action, ...containerProps }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const readableFromTokenAmountSold = useMemo(
    () =>
      swap &&
      convertWeiToTokens({
        valueWei:
          swap.direction === 'exactAmountIn'
            ? swap.fromTokenAmountSoldWei
            : swap.maximumFromTokenAmountSoldWei,
        token: swap.fromToken,
        returnInReadableFormat: true,
      }),
    [swap],
  );

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

  const getLastLineLabel = () => {
    if (!swap) {
      return PLACEHOLDER_KEY;
    }

    if (action === 'repay') {
      return t('swapDetails.label.repay');
    }

    if (action === 'supply') {
      return t('swapDetails.label.supply');
    }

    return swap.direction === 'exactAmountIn'
      ? t('swapDetails.label.minimumReceived')
      : t('swapDetails.label.maximumSold');
  };

  const getLastLineValue = () => {
    if (!swap) {
      return PLACEHOLDER_KEY;
    }

    if (action === 'repay') {
      return swap.direction === 'exactAmountIn'
        ? t('swapDetails.value.estimatedAmount', {
            value: readableToTokenAmountReceived,
          })
        : t('swapDetails.value.exactAmount', {
            value: readableToTokenAmountReceived,
          });
    }

    if (action === 'supply') {
      return t('swapDetails.value.estimatedAmount', {
        value: readableToTokenAmountReceived,
      });
    }

    if (action === 'swap' && swap) {
      return t('swapDetails.value.exactAmount', {
        value:
          swap.direction === 'exactAmountIn'
            ? readableToTokenAmountReceived
            : readableFromTokenAmountSold,
      });
    }
  };

  const readablePriceImpact = useMemo(
    () => swap && formatToReadablePercentage(swap.priceImpactPercentage),
    [swap?.priceImpactPercentage],
  );

  return (
    <div {...containerProps}>
      {swap && (
        <LabeledInlineContent label={t('swapDetails.label.exchangeRate')} css={styles.row}>
          {t('swapDetails.value.exchangeRate', {
            fromTokenSymbol: swap.fromToken.symbol,
            toTokenSymbol: swap.toToken.symbol,
            rate: readableExchangeRate,
          })}
        </LabeledInlineContent>
      )}

      <LabeledInlineContent label={t('swapDetails.label.slippageTolerance')} css={styles.row}>
        {readableSlippageTolerancePercentage}
      </LabeledInlineContent>

      {swap && (
        <>
          <LabeledInlineContent
            label={t('swapDetails.label.priceImpact')}
            css={styles.row}
            tooltip={t('swapDetails.tooltip.priceImpact')}
          >
            {t('swapDetails.value.priceImpact', { priceImpact: readablePriceImpact })}
          </LabeledInlineContent>

          <LabeledInlineContent label={getLastLineLabel()} css={styles.row}>
            {getLastLineValue()}
          </LabeledInlineContent>
        </>
      )}
    </div>
  );
};

export default SwapDetails;
