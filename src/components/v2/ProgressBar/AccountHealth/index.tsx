/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import calculatePercentage from 'utilities/calculatePercentage';
import { useTranslation } from 'translation';
import { ProgressBar } from '..';
import { useStyles } from './styles';

export interface IAccountHealthProps {
  borrowBalanceCents: number | undefined;
  borrowLimitCents: number | undefined;
  safeBorrowLimitPercentage: number;
  hypotheticalBorrowBalanceCents?: number;
  variant?: 'borrowBalance' | 'borrowLimitUsed';
  className?: string;
}

export const AccountHealth: React.FC<IAccountHealthProps> = ({
  className,
  borrowBalanceCents,
  borrowLimitCents,
  variant = 'borrowBalance',
  hypotheticalBorrowBalanceCents,
  safeBorrowLimitPercentage,
}) => {
  const styles = useStyles();
  const { t, Trans } = useTranslation();

  const borrowLimitUsedPercentage =
    typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
      ? calculatePercentage({
          numerator: borrowBalanceCents,
          denominator: borrowLimitCents,
        })
      : undefined;

  const hypotheticalBorrowLimitUsedPercentage =
    typeof hypotheticalBorrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
      ? calculatePercentage({
          numerator: hypotheticalBorrowBalanceCents,
          denominator: borrowLimitCents,
        })
      : undefined;

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

  const readableBorrowBalance = formatCentsToReadableValue({
    value: borrowBalanceCents,
  });

  return (
    <div className={className}>
      <div css={styles.topProgressBarLegend}>
        <div css={styles.inlineContainer}>
          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            {variant === 'borrowBalance'
              ? t('accountHealth.currentBorrowBalance')
              : t('accountHealth.borrowLimitUsed')}
          </Typography>

          <Typography component="span" variant="small1" color="text.borrowBalance">
            {variant === 'borrowBalance'
              ? readableBorrowBalance
              : readableBorrowLimitUsedPercentage}
          </Typography>
        </div>

        <div css={styles.inlineContainer}>
          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            {variant === 'borrowBalance' ? t('accountHealth.max') : t('accountHealth.limit')}
          </Typography>

          <Typography component="span" variant="small1" color="text.borrowBalance">
            {readableBorrowLimit}
          </Typography>
        </div>
      </div>

      <ProgressBar
        value={borrowLimitUsedPercentage || 0}
        secondaryValue={hypotheticalBorrowLimitUsedPercentage}
        mark={safeBorrowLimitPercentage}
        step={1}
        ariaLabel={t('accountHealth.accessibilityLabel')}
        min={0}
        max={100}
        trackTooltip={
          readableBorrowBalance !== PLACEHOLDER_KEY &&
          readableBorrowLimitUsedPercentage !== PLACEHOLDER_KEY ? (
            <Trans
              i18nKey="accountHealth.borrowLimitTooltip"
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
              i18nKey="accountHealth.safeBorrowLimitTooltip"
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
      />
    </div>
  );
};

export const BorrowBalanceAccountHealth = (props: IAccountHealthProps) => (
  <AccountHealth variant="borrowBalance" {...props} />
);

export const BorrowLimitUsedAccountHealth = (props: IAccountHealthProps) => (
  <AccountHealth variant="borrowLimitUsed" {...props} />
);
