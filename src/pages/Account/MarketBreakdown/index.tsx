/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
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
import TEST_IDS from './testIds';
import useExtractData from './useExtractData';

export interface MarketBreakdownProps {
  marketName: string;
  riskLevel: MarketRiskLevel;
  isXvsEnabled: boolean;
  assets: Asset[];
  dailyXvsDistributionInterestsCents?: BigNumber;
  className?: string;
}

// TODO: add tests

export const MarketBreakdown: React.FC<MarketBreakdownProps> = ({
  marketName,
  assets,
  isXvsEnabled,
  riskLevel,
  dailyXvsDistributionInterestsCents,
  className,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const {
    totalSupplyCents,
    totalBorrowCents,
    borrowLimitCents,
    readableSafeBorrowLimit,
    safeBorrowLimitPercentage,
    dailyEarningsCents,
    netApyPercentage,
  } = useExtractData({
    assets,
    isXvsEnabled,
    dailyXvsDistributionInterestsCents,
  });

  const cells: Cell[] = [
    {
      label: t('account.marketBreakdown.cellGroup.netApy'),
      value: formatToReadablePercentage(netApyPercentage),
      tooltip: t('account.marketBreakdown.cellGroup.netApyTooltip'),
      color: styles.getNetApyColor({ netApyPercentage: netApyPercentage || 0 }),
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

      <Paper css={styles.statsContainer} data-testid={TEST_IDS.stats}>
        <CellGroup smallValues cells={cells} css={styles.cellGroup} />

        <div css={styles.accountHealth}>
          <BorrowLimitUsedAccountHealth
            variant="borrowLimitUsed"
            borrowBalanceCents={totalBorrowCents.toNumber()}
            borrowLimitCents={borrowLimitCents.toNumber()}
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

      <Tables assets={assets} isXvsEnabled={isXvsEnabled} />
    </div>
  );
};

export default MarketBreakdown;
