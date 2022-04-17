/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import PLACEHOLDER_KEY from 'constants/paceholderKey';
import { formatCentsToReadableValue } from 'utilities/common';
import { useTranslation } from 'translation';
import { IToggleProps, Toggle, Icon, ProgressBarHorizontal, Tooltip } from 'components';
import { useMyAccountStyles as useStyles } from './styles';

export interface IMyAccountUiProps {
  netApyPercentage: number | undefined;
  dailyEarningsCents: number | undefined;
  supplyBalanceCents: number | undefined;
  borrowBalanceCents: number | undefined;
  borrowLimitCents: number | undefined;
  safeBorrowLimitPercentage: number;
  withXvs: boolean;
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
  withXvs,
  onXvsToggle,
  className,
}: IMyAccountUiProps) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const handleXvsToggleChange: IToggleProps['onChange'] = (_event, checked) => onXvsToggle(checked);

  const readableBorrowBalance =
    typeof borrowBalanceCents === 'number'
      ? formatCentsToReadableValue(borrowBalanceCents)
      : PLACEHOLDER_KEY;

  let borrowLimitUsedPercentage: number | undefined;
  if (borrowLimitCents === 0) {
    borrowLimitUsedPercentage = 0;
  } else if (typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number') {
    borrowLimitUsedPercentage = Math.round((borrowBalanceCents * 100) / borrowLimitCents);
  }

  const readableBorrowLimitUsedPercentage =
    typeof borrowLimitUsedPercentage === 'number'
      ? `${borrowLimitUsedPercentage}%`
      : PLACEHOLDER_KEY;

  const safeBorrowLimitCents =
    typeof borrowLimitCents === 'number'
      ? Math.floor((borrowLimitCents * safeBorrowLimitPercentage) / 100)
      : undefined;

  const readableSafeBorrowLimit =
    typeof safeBorrowLimitCents === 'number'
      ? formatCentsToReadableValue(safeBorrowLimitCents, true)
      : PLACEHOLDER_KEY;

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

          <Toggle css={styles.toggle} value={withXvs} onChange={handleXvsToggleChange} />
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
          {typeof netApyPercentage === 'number' ? `${netApyPercentage}%` : PLACEHOLDER_KEY}
        </Typography>
      </div>

      <ul css={styles.list}>
        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="span" variant="small2" css={styles.labelListItem}>
            {t('myAccount.dailyEarnings')}
          </Typography>

          {typeof dailyEarningsCents === 'number'
            ? formatCentsToReadableValue(dailyEarningsCents)
            : PLACEHOLDER_KEY}
        </Typography>

        <Typography component="li" variant="h4" css={styles.item}>
          <Typography component="span" variant="small2" css={styles.labelListItem}>
            {t('myAccount.supplyBalance')}
          </Typography>

          {typeof supplyBalanceCents === 'number'
            ? formatCentsToReadableValue(supplyBalanceCents)
            : PLACEHOLDER_KEY}
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
            {typeof borrowLimitCents === 'number'
              ? formatCentsToReadableValue(borrowLimitCents, true)
              : PLACEHOLDER_KEY}
          </Typography>
        </div>
      </div>

      <ProgressBarHorizontal
        css={styles.progressBar}
        value={borrowLimitUsedPercentage || 0}
        mark={safeBorrowLimitPercentage}
        step={1}
        ariaLabel={t('myAccount.progressBar.accessibilityLabel')}
        min={0}
        max={100}
        trackTooltip={
          readableBorrowBalance !== PLACEHOLDER_KEY &&
          readableBorrowLimitUsedPercentage && (
            <Trans
              i18nKey="myAccount.progressBar.borrowLimitTooltip"
              values={{
                borrowBalance: readableBorrowBalance,
                borrowLimitUsedPercentage: readableBorrowLimitUsedPercentage,
              }}
            >
              Current borrow balance:
              <br />
              {readableBorrowBalance} ({readableBorrowLimitUsedPercentage} of your borrow limit)
            </Trans>
          )
        }
        markTooltip={
          readableSafeBorrowLimit !== PLACEHOLDER_KEY &&
          safeBorrowLimitCents &&
          safeBorrowLimitCents > 0 && (
            <Trans
              i18nKey="myAccount.progressBar.safeBorrowLimitTooltip"
              values={{
                safeBorrowLimit: readableSafeBorrowLimit,
                safeBorrowLimitPercentage,
              }}
            >
              Safe borrow limit:
              <br />
              {readableSafeBorrowLimit} ({safeBorrowLimitPercentage}% of your borrow limit)
            </Trans>
          )
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
