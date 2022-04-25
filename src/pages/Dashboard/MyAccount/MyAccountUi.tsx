/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import { useTranslation } from 'translation';
import { IToggleProps, Toggle, Icon, ProgressBar, Tooltip } from 'components';
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
  const { t, Trans } = useTranslation();

  const handleXvsToggleChange: IToggleProps['onChange'] = (_event, checked) => onXvsToggle(checked);

  let borrowLimitUsedPercentage: number | undefined;
  if (borrowLimitCents === 0) {
    borrowLimitUsedPercentage = 0;
  } else if (typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number') {
    borrowLimitUsedPercentage = Math.round((borrowBalanceCents * 100) / borrowLimitCents);
  }

  const readableBorrowLimitUsedPercentage = formatToReadablePercentage(borrowLimitUsedPercentage);

  const safeBorrowLimitCents =
    typeof borrowLimitCents === 'number'
      ? Math.floor((borrowLimitCents * safeBorrowLimitPercentage) / 100)
      : undefined;

  const readableSafeBorrowLimit = formatCentsToReadableValue({
    value: safeBorrowLimitCents,
  });

  const readableBorrowLimit = formatCentsToReadableValue({
    value: borrowLimitCents,
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
    <div css={styles.container} className={className}>
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

      <div css={[styles.row, styles.topProgressBarLegend]}>
        <div css={styles.inlineContainer}>
          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            {t('myAccount.borrowLimitUsed')}
          </Typography>

          <Typography component="span" variant="small1" color="text.primary">
            {readableBorrowLimitUsedPercentage}
          </Typography>
        </div>

        <div css={styles.inlineContainer}>
          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            {t('myAccount.limit')}
          </Typography>

          <Typography component="span" variant="small1" color="text.primary">
            {readableBorrowLimit}
          </Typography>
        </div>
      </div>

      <ProgressBar
        css={styles.progressBar}
        value={borrowLimitUsedPercentage || 0}
        mark={safeBorrowLimitPercentage}
        step={1}
        ariaLabel={t('myAccount.progressBar.accessibilityLabel')}
        min={0}
        max={100}
        trackTooltip={
          readableBorrowBalance !== PLACEHOLDER_KEY &&
          readableBorrowLimitUsedPercentage !== PLACEHOLDER_KEY ? (
            <Trans
              i18nKey="myAccount.progressBar.borrowLimitTooltip"
              components={{
                LineBreak: <br />,
              }}
              values={{
                borrowBalance: readableBorrowBalance,
                borrowLimitUsedPercentage: readableBorrowLimitUsedPercentage,
              }}
            />
          ) : undefined
        }
        markTooltip={
          readableSafeBorrowLimit !== PLACEHOLDER_KEY &&
          borrowBalanceCents &&
          borrowBalanceCents > 0 ? (
            <Trans
              i18nKey="myAccount.progressBar.safeBorrowLimitTooltip"
              components={{
                LineBreak: <br />,
              }}
              values={{
                safeBorrowLimit: readableSafeBorrowLimit,
                safeBorrowLimitPercentage,
              }}
            />
          ) : undefined
        }
        isDisabled
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
    </div>
  );
};

export default MyAccountUi;
