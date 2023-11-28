/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';

import PLACEHOLDER_KEY from 'constants/placeholderKey';
import useProgressColor from 'hooks/useProgressColor';
import { useTranslation } from 'packages/translations';
import {
  calculatePercentage,
  formatCentsToReadableValue,
  formatPercentageToReadableValue,
} from 'utilities';

import { LabeledProgressBar } from '../LabeledProgressBar';

export interface AccountHealthProps {
  borrowBalanceCents: number | undefined;
  borrowLimitCents: number | undefined;
  safeBorrowLimitPercentage: number;
  hypotheticalBorrowBalanceCents?: number;
  variant?: 'borrowBalance' | 'borrowLimitUsed';
  className?: string;
}

export const AccountHealth: React.FC<AccountHealthProps> = ({
  className,
  borrowBalanceCents,
  borrowLimitCents,
  variant = 'borrowBalance',
  hypotheticalBorrowBalanceCents,
  safeBorrowLimitPercentage,
}) => {
  const { t, Trans } = useTranslation();

  const borrowLimitUsedPercentage = useMemo(
    () =>
      typeof borrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
        ? calculatePercentage({
            numerator: borrowBalanceCents,
            denominator: borrowLimitCents,
          })
        : undefined,
    [borrowBalanceCents, borrowLimitCents],
  );

  const hypotheticalBorrowLimitUsedPercentage = useMemo(
    () =>
      typeof hypotheticalBorrowBalanceCents === 'number' && typeof borrowLimitCents === 'number'
        ? calculatePercentage({
            numerator: hypotheticalBorrowBalanceCents,
            denominator: borrowLimitCents,
          })
        : undefined,
    [hypotheticalBorrowBalanceCents, borrowLimitCents],
  );

  const { readableBorrowLimitUsedPercentage, sanitizedBorrowLimitUsedPercentage } = useMemo(
    () => ({
      readableBorrowLimitUsedPercentage: formatPercentageToReadableValue(borrowLimitUsedPercentage),
      sanitizedBorrowLimitUsedPercentage: borrowLimitUsedPercentage || 0,
    }),
    [borrowLimitUsedPercentage],
  );

  const readableSafeBorrowLimit = useMemo(() => {
    const safeBorrowLimitCents =
      typeof borrowLimitCents === 'number'
        ? Math.floor((borrowLimitCents * safeBorrowLimitPercentage) / 100)
        : undefined;

    return formatCentsToReadableValue({
      value: safeBorrowLimitCents,
    });
  }, [borrowLimitCents, safeBorrowLimitPercentage]);

  const readableBorrowLimit = useMemo(
    () =>
      formatCentsToReadableValue({
        value: borrowLimitCents,
      }),
    [borrowLimitCents],
  );

  const readableBorrowBalance = useMemo(
    () =>
      formatCentsToReadableValue({
        value: borrowBalanceCents,
      }),
    [borrowBalanceCents],
  );

  const trackTooltip = useMemo(
    () =>
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
      ) : undefined,
    [readableBorrowBalance, readableBorrowLimitUsedPercentage, Trans],
  );

  const markTooltip = useMemo(
    () =>
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
      ) : undefined,
    [readableSafeBorrowLimit, borrowBalanceCents, safeBorrowLimitPercentage, Trans],
  );

  const progressBarColor = useProgressColor(sanitizedBorrowLimitUsedPercentage);

  return (
    <div className={className}>
      <LabeledProgressBar
        greyLeftText={
          variant === 'borrowBalance'
            ? t('accountHealth.currentBorrowBalance')
            : t('accountHealth.borrowLimitUsed')
        }
        whiteLeftText={
          variant === 'borrowBalance' ? readableBorrowBalance : readableBorrowLimitUsedPercentage
        }
        greyRightText={
          variant === 'borrowBalance' ? t('accountHealth.max') : t('accountHealth.limit')
        }
        whiteRightText={readableBorrowLimit}
        value={sanitizedBorrowLimitUsedPercentage}
        secondaryValue={hypotheticalBorrowLimitUsedPercentage}
        mark={safeBorrowLimitPercentage}
        step={1}
        ariaLabel={t('accountHealth.accessibilityLabel')}
        min={0}
        max={100}
        trackTooltip={trackTooltip}
        markTooltip={markTooltip}
        progressBarColor={progressBarColor}
      />
    </div>
  );
};

export const BorrowBalanceAccountHealth = (props: AccountHealthProps) => (
  <AccountHealth variant="borrowBalance" {...props} />
);

export const BorrowLimitUsedAccountHealth = (props: AccountHealthProps) => (
  <AccountHealth variant="borrowLimitUsed" {...props} />
);
