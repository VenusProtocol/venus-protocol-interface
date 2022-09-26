/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Cell, CellGroup, Toggle } from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities';

import { poolData } from '__mocks__/models/pools';
import { IncludeXvsContext } from 'context/IncludeXvsContext';

import PoolBreakdown from './PoolBreakdown';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface AccountUiProps {
  pools: Pool[];
  netApyPercentage: number;
  dailyEarningsCents: number;
  totalSupplyCents: number;
  totalBorrowCents: number;
  includeXvs: boolean;
  onIncludeXvsToggleChange: (newValue: boolean) => void;
}

export const AccountUi: React.FC<AccountUiProps> = ({
  netApyPercentage,
  dailyEarningsCents,
  totalSupplyCents,
  totalBorrowCents,
  includeXvs,
  pools,
  onIncludeXvsToggleChange,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const cells: Cell[] = [
    {
      label: t('account.accountSummary.netApy'),
      value: formatToReadablePercentage(netApyPercentage),
      tooltip: t('account.accountSummary.netApyTooltip'),
      color: styles.getNetApyColor({ netApyPercentage }),
    },
    {
      label: t('account.accountSummary.dailyEarnings'),
      value: formatCentsToReadableValue({ value: dailyEarningsCents }),
    },
    {
      label: t('account.accountSummary.totalSupply'),
      value: formatCentsToReadableValue({ value: totalSupplyCents }),
    },
    {
      label: t('account.accountSummary.totalBorrow'),
      value: formatCentsToReadableValue({ value: totalBorrowCents }),
    },
  ];

  return (
    <>
      <div css={styles.section}>
        <div css={styles.sectionTitle}>
          <Typography variant="h3" css={styles.sectionTitleText}>
            {t('account.accountSummary.title')}
          </Typography>

          <Toggle
            css={styles.sectionTitleToggle}
            tooltip={t('account.accountSummary.includeXvsToggleTooltip')}
            label={t('account.accountSummary.includeXvsToggleLabel')}
            isLight
            value={includeXvs}
            onChange={event => onIncludeXvsToggleChange(event.currentTarget.checked)}
          />
        </div>

        <CellGroup cells={cells} data-testid={TEST_IDS.stats} />
      </div>

      {pools.map(pool => (
        <PoolBreakdown
          key={`pool-breakdown-${pool.name}`}
          css={styles.section}
          pool={pool}
          includeXvs={includeXvs}
        />
      ))}
    </>
  );
};

const Account: React.FC = () => {
  const { includeXvs, setIncludeXvs } = useContext(IncludeXvsContext);

  // TODO: fetch (see VEN-548)
  const netApyPercentage = 13.4;
  const dailyEarningsCents = 100000;
  const totalSupplyCents = 100000000;
  const totalBorrowCents = 10000000;

  return (
    <AccountUi
      netApyPercentage={netApyPercentage}
      dailyEarningsCents={dailyEarningsCents}
      totalSupplyCents={totalSupplyCents}
      totalBorrowCents={totalBorrowCents}
      includeXvs={includeXvs}
      onIncludeXvsToggleChange={setIncludeXvs}
      pools={poolData}
    />
  );
};

export default Account;
