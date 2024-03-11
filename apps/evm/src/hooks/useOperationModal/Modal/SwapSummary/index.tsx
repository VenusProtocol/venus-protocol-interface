/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import type { Swap } from 'types';
import { convertMantissaToTokens } from 'utilities';

import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface SwapSummaryProps {
  type: 'supply' | 'repay';
  swap?: Swap;
}

export const SwapSummary: React.FC<SwapSummaryProps> = ({ swap, type }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const swapSummary = useMemo(() => {
    if (!swap) {
      return undefined;
    }

    const fromTokenAmountMantissa =
      swap.direction === 'exactAmountIn'
        ? swap.fromTokenAmountSoldMantissa
        : swap.expectedFromTokenAmountSoldMantissa;
    const toTokenAmountMantissa =
      swap.direction === 'exactAmountIn'
        ? swap.expectedToTokenAmountReceivedMantissa
        : swap.toTokenAmountReceivedMantissa;

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
      ? t('operationModal.swapSummary.repay', args)
      : t('operationModal.swapSummary.supply', args);
  }, [swap, type, t]);

  if (!swap) {
    return null;
  }

  return (
    <Typography
      data-testid={TEST_IDS.swapSummary}
      css={styles.swapSummary}
      variant="small2"
      component="div"
    >
      {swapSummary}
    </Typography>
  );
};

export default SwapSummary;
