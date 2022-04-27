/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import { useTranslation } from 'translation';
import { IToggleProps, Toggle, Icon, Tooltip, BorrowLimitUsedAccountHealth } from 'components';
import Paper from '@mui/material/Paper';
import { useMyAccountStyles as useStyles } from './styles';

export interface IMyAccountUiProps {
  netApyPercentage: number | undefined;
  dailyEarningsCents: number | undefined;
  supplyBalanceCents: number | undefined;
  borrowBalanceCents: number | undefined;
  borrowLimitCents: number | undefined;
  safeBorrowLimitPercentage: number;
  isXvsEnabled: boolean;
  onXvsToggle: (newValue: boolean) => void;
  className?: string;
}

export const MyAccountUi = ({
  netApyPercentage,
  dailyEarningsCents,
  supplyBalanceCents,
  borrowBalanceCents,
  borrowLimitCents,
  safeBorrowLimitPercentage,
  isXvsEnabled,
  onXvsToggle,
  className,
}: IMyAccountUiProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const handleXvsToggleChange: IToggleProps['onChange'] = (_event, checked) => onXvsToggle(checked);

  const safeBorrowLimitCents =
    typeof borrowLimitCents === 'number'
      ? Math.floor((borrowLimitCents * safeBorrowLimitPercentage) / 100)
      : undefined;

  const readableSafeBorrowLimit = formatCentsToReadableValue({
    value: safeBorrowLimitCents,
  });

  const readableNetApyPercentage = formatToReadablePercentage(netApyPercentage);

  const readableBorrowBalance = formatCentsToReadableValue({
    value: borrowBalanceCents,
  });

  const readableDailyEarnings = formatCentsToReadableValue({
    value: dailyEarningsCents,
  });

  const readableSupplyBalance = formatCentsToReadableValue({
    value: supplyBalanceCents,
  });

  return (
    <Paper css={styles.container} className={className}>
      <div css={[styles.row, styles.header]}>
        <Typography variant="h4">{t('myAccount.title')}</Typography>

        <div css={styles.apyWithXvs}>
          <Tooltip css={styles.tooltip} title={t('myAccount.apyWithXvsTooltip')}>
            <Icon css={styles.infoIcon} name="info" />
          </Tooltip>

          <Typography
            color="text.primary"
            variant="small1"
            component="span"
            css={styles.apyWithXvsLabel}
          >
            {t('myAccount.apyWithXvs')}
          </Typography>

          <Toggle css={styles.toggle} value={isXvsEnabled} onChange={handleXvsToggleChange} />
        </div>
      </div>

      <div css={styles.netApyContainer}>
        <div css={styles.netApy}>
          <Typography component="span" variant="small2" css={styles.netApyLabel}>
            {t('myAccount.netApy')}
          </Typography>

          <Tooltip css={styles.tooltip} title={t('myAccount.netApyTooltip')}>
            <Icon css={styles.infoIcon} name="info" />
          </Tooltip>
        </div>

        <Typography variant="h1" color="interactive.success" component="span">
          {readableNetApyPercentage}
        </Typography>
      </div>

      <ul css={styles.list}>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="span" variant="small2" css={styles.labelListItem}>
            {t('myAccount.dailyEarnings')}
          </Typography>

          {readableDailyEarnings}
        </Typography>

        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="span" variant="small2" css={styles.labelListItem}>
            {t('myAccount.supplyBalance')}
          </Typography>

          {readableSupplyBalance}
        </Typography>

        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="span" variant="small2" css={styles.labelListItem}>
            {t('myAccount.borrowBalance')}
          </Typography>

          {readableBorrowBalance}
        </Typography>
      </ul>

      <BorrowLimitUsedAccountHealth
        css={styles.progressBar}
        borrowBalanceCents={borrowBalanceCents}
        safeBorrowLimitPercentage={safeBorrowLimitPercentage}
        borrowLimitCents={borrowLimitCents}
      />

      <div css={styles.bottom}>
        <Icon name="shield" css={styles.shieldIcon} />

        <Typography component="span" variant="small2" css={styles.inlineLabel}>
          {t('myAccount.safeLimit')}
        </Typography>

        <Typography component="span" variant="small1" color="text.primary" css={styles.safeLimit}>
          {readableSafeBorrowLimit}
        </Typography>

        <Tooltip
          css={styles.tooltip}
          title={t('myAccount.safeLimitTooltip', { safeBorrowLimitPercentage })}
        >
          <Icon css={styles.infoIcon} name="info" />
        </Tooltip>
      </div>
    </Paper>
  );
};

export default MyAccountUi;
