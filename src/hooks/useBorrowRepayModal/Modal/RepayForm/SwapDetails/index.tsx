/** @jsxImportSource @emotion/react */
import { Delimiter, LabeledInlineContent } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap } from 'types';
import { convertWeiToTokens, formatToReadablePercentage } from 'utilities';

import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';

import { useStyles as useSharedStyles } from '../../styles';
import { useStyles } from './styles';

const readableSlippageTolerancePercentage = formatToReadablePercentage(
  SLIPPAGE_TOLERANCE_PERCENTAGE,
);

export interface SwapDetailsProps {
  swap?: Swap;
  'data-testid'?: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({ swap, ...containerProps }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const sharedStyles = useSharedStyles();

  const readableToTokenAmountRepaidTokens = useMemo(
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

  return (
    <div css={[styles.container, sharedStyles.getRow({ isLast: true })]} {...containerProps}>
      {swap && (
        <LabeledInlineContent
          label={t('borrowRepayModal.repay.swapDetails.exchangeRate.label')}
          css={sharedStyles.getRow({ isLast: false })}
        >
          {t('borrowRepayModal.repay.swapDetails.exchangeRate.value', {
            fromTokenSymbol: swap.fromToken.symbol,
            toTokenSymbol: swap.toToken.symbol,
            rate: swap.exchangeRate.toFixed(),
          })}
        </LabeledInlineContent>
      )}

      <LabeledInlineContent
        label={t('borrowRepayModal.repay.swapDetails.slippageTolerance.label')}
        css={sharedStyles.getRow({ isLast: !swap })}
      >
        {readableSlippageTolerancePercentage}
      </LabeledInlineContent>

      {swap && (
        <LabeledInlineContent
          label={t('borrowRepayModal.repay.swapDetails.repayAmount.label')}
          css={sharedStyles.getRow({ isLast: true })}
        >
          {swap.direction === 'exactAmountIn'
            ? t('borrowRepayModal.repay.swapDetails.repayAmount.estimatedValue', {
                value: readableToTokenAmountRepaidTokens,
              })
            : t('borrowRepayModal.repay.swapDetails.repayAmount.exactValue', {
                value: readableToTokenAmountRepaidTokens,
              })}
        </LabeledInlineContent>
      )}

      <Delimiter />
    </div>
  );
};

export default SwapDetails;
