/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Swap } from 'types';
import { convertWeiToTokens } from 'utilities';

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

    const fromTokenAmountWei =
      swap.direction === 'exactAmountIn'
        ? swap.fromTokenAmountSoldWei
        : swap.expectedFromTokenAmountSoldWei;
    const toTokenAmountWei =
      swap.direction === 'exactAmountIn'
        ? swap.expectedToTokenAmountReceivedWei
        : swap.toTokenAmountReceivedWei;

    const readableFromTokenAmount = convertWeiToTokens({
      valueWei: fromTokenAmountWei,
      token: swap.fromToken,
      returnInReadableFormat: true,
    });

    const readableToTokenAmount = convertWeiToTokens({
      valueWei: toTokenAmountWei,
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
  }, [swap, type]);

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
