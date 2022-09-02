/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Cell, CellGroup, Toggle } from 'components';
import React from 'react';
import { useTranslation } from 'translation';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities';

import { useStyles } from './styles';

export interface AccountUiProps {
  netApyPercentage: number;
  dailyEarningsCents: number;
  totalSupplyCents: number;
  totalBorrowCents: number;
  isXvsIncluded: boolean;
  onIncludeXvsToggleChange: (newValue: boolean) => void;
}

export const AccountUi: React.FC<AccountUiProps> = ({
  netApyPercentage,
  dailyEarningsCents,
  totalSupplyCents,
  totalBorrowCents,
  isXvsIncluded,
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
            value={isXvsIncluded}
            onChange={event => onIncludeXvsToggleChange(event.currentTarget.checked)}
          />
        </div>

        <CellGroup cells={cells} />
      </div>
    </>
  );
};

const Account: React.FC = () => {
  // TODO: fetch (see VEN-548)
  const netApyPercentage = 13.4;
  const dailyEarningsCents = 100000;
  const totalSupplyCents = 100000000;
  const totalBorrowCents = 10000000;
  // TODO: wire to context (see VEN-490)
  const isXvsIncluded = true;
  const onIncludeXvsToggleChange = () => {};

  return (
    <AccountUi
      netApyPercentage={netApyPercentage}
      dailyEarningsCents={dailyEarningsCents}
      totalSupplyCents={totalSupplyCents}
      totalBorrowCents={totalBorrowCents}
      isXvsIncluded={isXvsIncluded}
      onIncludeXvsToggleChange={onIncludeXvsToggleChange}
    />
  );
};

export default Account;
