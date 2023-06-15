/** @jsxImportSource @emotion/react */
import { Paper, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { BorrowLimitUsedAccountHealth, Cell, CellGroup, Icon, Tooltip } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { Pool, Vault } from 'types';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities';

import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';

import { useStyles } from './styles';
import TEST_IDS from './testIds';
import useExtractData from './useExtractData';

export interface SummaryProps {
  pools: Pool[];
  vaults?: Vault[];
  xvsPriceCents?: BigNumber;
  vaiPriceCents?: BigNumber;
  displayAccountHealth?: boolean;
  displayTotalVaultStake?: boolean;
  className?: string;
}

export const Summary: React.FC<SummaryProps> = ({
  pools,
  vaults,
  displayAccountHealth = false,
  displayTotalVaultStake = false,
  xvsPriceCents = new BigNumber(0),
  vaiPriceCents = new BigNumber(0),
  className,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const {
    totalSupplyCents,
    totalBorrowCents,
    totalVaultStakeCents,
    borrowLimitCents,
    readableSafeBorrowLimit,
    safeBorrowLimitPercentage,
    dailyEarningsCents,
    netApyPercentage,
  } = useExtractData({
    pools,
    vaults: vaults || [],
    xvsPriceCents,
    vaiPriceCents,
  });

  const cells: Cell[] = [
    {
      label: t('account.marketBreakdown.cellGroup.netApy'),
      value: formatToReadablePercentage(netApyPercentage),
      tooltip: displayTotalVaultStake
        ? t('account.marketBreakdown.cellGroup.netApyWithVaultStakeTooltip')
        : t('account.marketBreakdown.cellGroup.netApyTooltip'),
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

  if (displayTotalVaultStake) {
    cells.push({
      label: t('account.marketBreakdown.cellGroup.totalVaultStake'),
      value: formatCentsToReadableValue({ value: totalVaultStakeCents }),
    });
  }

  return (
    <Paper css={styles.container} className={className} data-testid={TEST_IDS.container}>
      <CellGroup
        smallValues={displayAccountHealth}
        cells={cells}
        css={styles.cellGroup}
        data-testid={TEST_IDS.stats}
      />

      {displayAccountHealth && (
        <div css={styles.accountHealth} data-testid={TEST_IDS.accountHealth}>
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
      )}
    </Paper>
  );
};

export default Summary;
