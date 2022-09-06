/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import {
  BorrowLimitUsedAccountHealth,
  Cell,
  CellGroup,
  Icon,
  RiskLevel,
  Tooltip,
} from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Asset, MarketRiskLevel } from 'types';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';

import Tables from './Tables';
import { useStyles } from './styles';

export interface MarketBreakdownProps {
  marketName: string;
  riskLevel: MarketRiskLevel;
  assets: Asset[];
  className?: string;
}

export const MarketBreakdown: React.FC<MarketBreakdownProps> = ({
  marketName,
  assets,
  riskLevel,
  className,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  // TODO: calculate using assets
  const netApyPercentage = 0.14;
  const dailyEarningsCents = 1298736123;
  const totalSupplyCents = 123127386;
  const totalBorrowCents = 98712;
  const borrowLimitCents = 219271;

  const safeBorrowLimitCents = Math.floor((borrowLimitCents * SAFE_BORROW_LIMIT_PERCENTAGE) / 100);
  const readableSafeBorrowLimit = formatCentsToReadableValue({
    value: safeBorrowLimitCents,
  });
  const safeBorrowLimitPercentage = formatToReadablePercentage(
    (safeBorrowLimitCents * 100) / borrowLimitCents,
  );

  const cells: Cell[] = [
    {
      label: t('account.marketBreakdown.cellGroup.netApy'),
      value: formatToReadablePercentage(netApyPercentage),
      tooltip: t('account.marketBreakdown.cellGroup.netApyTooltip'),
      color: styles.getNetApyColor({ netApyPercentage }),
    },
    {
      label: t('account.marketBreakdown.cellGroup.dailyEarnings'),
      value: formatCentsToReadableValue({ value: dailyEarningsCents }),
    },
    {
      label: t('account.marketBreakdown.cellGroup.totalSupply'),
      value: formatCentsToReadableValue({ value: totalSupplyCents }),
    },
    {
      label: t('account.marketBreakdown.cellGroup.totalBorrow'),
      value: formatCentsToReadableValue({ value: totalBorrowCents }),
    },
  ];

  return (
    <div className={className}>
      <div css={styles.title}>
        <Typography css={styles.marketName} variant="h4">
          {marketName}
        </Typography>

        <RiskLevel variant={riskLevel} />
      </div>

      <Paper css={styles.statsContainer}>
        <CellGroup smallValues cells={cells} css={styles.cellGroup} />

        <div css={styles.accountHealth}>
          <BorrowLimitUsedAccountHealth
            variant="borrowLimitUsed"
            borrowBalanceCents={totalBorrowCents}
            borrowLimitCents={borrowLimitCents}
            safeBorrowLimitPercentage={SAFE_BORROW_LIMIT_PERCENTAGE}
            css={styles.accountHealthProgressBar}
          />

          <div css={styles.accountHealthFooter}>
            <Icon name="shield" css={styles.shieldIcon} />

            <Typography component="span" variant="small2" css={styles.inlineLabel}>
              {t('myAccount.safeLimit')}
            </Typography>

            <Typography
              component="span"
              variant="small1"
              color="text.primary"
              css={styles.safeLimit}
            >
              {readableSafeBorrowLimit}
            </Typography>

            <Tooltip
              css={styles.tooltip}
              title={t('myAccount.safeLimitTooltip', { safeBorrowLimitPercentage })}
            >
              <Icon css={styles.infoIcon} name="info" />
            </Tooltip>
          </div>
        </div>
      </Paper>

      <Tables assets={assets} />
    </div>
  );
};

export default MarketBreakdown;
